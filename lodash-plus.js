var _ = require('lodash');

_.mixin({
	pickTruthy: function (obj, props) {
		return _.cond([
			[_.negate(_.isObject), function () {throw new Error('Invalid params');}],
			[this.argsLength(_.partial(_.isEqual, 1)), _.constant(_.pickBy(obj, this.isTruthy))],
			[_.flow(_.nthArg(1), _.isString), _.constant((this.isTruthy(obj[props]) ? _.pick(obj, props) : {}))],
			[_.flow(_.nthArg(1), _.isArray), _.constant(_.pickBy(_.pick(obj, props), this.isTruthy))],
			[_.constant(true), function () {throw new Error('Invalid params');}],
		]).apply(this, _.reject([obj, props], _.isUndefined));
	}
});

_.mixin({
	isFalsy: function (val) {
		return !Boolean(val);
	},
	isTruthy: function (val) {
		return Boolean(val);
	},
	isNullOrUndefined: function (val) {
		return _.isNull(val) || _.isUndefined(val);
	},
	isIntable: function (val) {
		return val == parseInt(val);
	}
});

_.mixin({
	argsLength: function (callback) {
		callback = callback || _.identity;
		return function () {
			return callback(arguments.length);
		};
	},
	fullSize: function(obj) {
		return _.reduce(
			_.pickBy(obj, _.isPlainObject),
			_.overArgs(_.add, _.identity, _.bind(this.fullSize, this)),
			_.size(obj)
		);
	},
	allPaths: function (obj, parentPath) {
		var self = this;
		parentPath = parentPath || '';
		var paths = _.map(_.keys(obj), function (key) {
			return parentPath ? parentPath + '.' + key : key;
		});
		if (_.some(obj, _.isPlainObject)) {
			_.each(_.pickBy(obj, _.isPlainObject), function (obj, key) {
				// console.info('obj', obj);
				paths = paths.concat(self.allPaths(obj, (parentPath ? parentPath + '.' + key : key)));
			});
		}
		return paths;
	}
});

_.mixin({
	collCloner: function (callback, self) {
		self = self || this;
		return function () {
			arguments[0] = _.cloneDeep(arguments[0]);
			return callback.apply(self, arguments);
		}
	}
});

_.mixin({
	hasAll: function (obj, array) {
		return _.every(array, _.partial(_.has, obj));
	},
	hasAny: function (obj, array) {
		return _.some(array, _.partial(_.has, obj));
	},
	includesAny: function (searchIn, searchFor) {
		if (_.isString(searchIn) && _.isString(searchFor)) {
			return _.some(searchFor, _.partial(_.includes, searchIn));
		}
		else if (_.every(searchIn, _.isPlainObject) && _.every(searchFor, _.isString)) {
			return !_.isEmpty(_.intersection(_.flatten(_.map(searchIn, _.keys)), searchFor))
		}
		else if (_.isArray(searchIn) && _.isArray(searchFor)) {
			return !_.isEmpty(_.intersection(searchIn, searchFor));
		}
		else if (_.isPlainObject(searchIn) && _.every(searchFor, _.isString)) {
			return !_.isEmpty(_.pick(searchIn, searchFor));
		}
		else {
			throw new Error('Invalid params');
		}
	}
});

_.mixin({
	extendAll: function (collection, sources) {
		var sources = _.slice(arguments, 1);
		if (_.some(
			_.union(collection, sources), 
			_.negate(_.isPlainObject))) {
			throw new Error('Invalid params');
		}
		_.each(collection, function (obj) {
			_.partial(_.extend, obj).apply(null, sources);
		});
		return collection;
	}
});

_.mixin({
	getAll: function (object, paths, default_) {
		return _.map(paths, _.partial(_.rearg(_.get, 0, 2, 1), object, default_));
	},
	getFirst: function (object, paths, default_) {
		return _.get(object, _.find(paths, _.partial(_.has, object)), default_);
	},
	setDefinite : function (object, path, value) {
		if (!_.isUndefined(value)) {
			return _.set(object, path, value);
		}
	}
});

_.mixin({
	// TODO: Rename as 'until' to match ruby inspiration?
	eachUntil: function (collection, callback, predicate) {
		predicate = predicate || _.identity
		_.each(collection, function (val, key, collection) {
			if (predicate(val, key, collection)) {
				return false;
			}
			callback(val, key, collection);
		});
	}
});

_.mixin({
	innerJoin: function (object1, object2) {
		// TODO: does not work for NaN
		var paths1 = _.sortBy(_.allPaths(object1));
		var paths2 = _.sortBy(_.allPaths(object2));
		
		var joinPathValPairs = _.map(paths1, function (path, index) {
			var obj1ValAtPath = _.cloneDeep(_.get(object1, path));
			if (_.has(object2, path) && _.isEqual(obj1ValAtPath, _.get(object2, path))) {
				return [path, obj1ValAtPath];
			}
			return null;
		});
		
		var joined = {};
		
		_.each(_.filter(joinPathValPairs), function (pair) {
			_.set(joined, pair[0], pair[1]);
		});
		
		return joined;
	}
})

module.exports = _;
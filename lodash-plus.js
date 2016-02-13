var _ = require('lodash');

_.mixin({
	pickTruthy: function (obj, props) {
		if (!_.isObject(obj)) {
			throw new Error('Invalid params');
		}
		else if (arguments.length === 1) {
			return _.pickBy(obj, this.isTruthy);
		}
		else if (_.isString(props)) {
			// What should the false case return here?
			return this.isTruthy(obj[props]) ? _.pick(obj, props) : {};
		}
		else if (_.isArray(props)) {
			return _.pickBy(_.pick(obj, props), this.isTruthy);
		}
		else {
			throw new Error('Invalid params');
		}
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
	argsLength: function (predicate) {
		predicate = predicate || this.isTruthy;
		return function () {
			return predicate(arguments.length);
		};
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

module.exports = _;
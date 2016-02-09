var _ = require('lodash');

_.mixin({
	isFalsy: function (val) {
		return !Boolean(val);
	},
	isTruthy: function (val) {
		return Boolean(val);
	},
	pickTruthy: function (obj, props) {
		if (!_.isObject(obj)) {
			throw new Error('Invalid params');
		}
		if (arguments.length === 1) {
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
	isNullOrUndefined: function (val) {
		return _.isNull(val) || _.isUndefined(val);
	}
});

_.mixin({
	includesAny: function (searchIn, searchFor) {
		if (_.isString(searchIn) && _.isString(searchFor)) {
			return _.some(searchFor, _.partial(_.includes, searchIn));
		}
		else if (_.every(searchIn, _.isPlainObject) && _.every(searchFor, _.isString)) {
			// TODO: Implement "hasAny" and simplify
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
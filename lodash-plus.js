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

module.exports = _;
var _ = require('./lodash-plus.js');
var assert = require('assert');



describe('lodash-plus', function () {
	var falsyAndTruthy = {
		a: false,
		b: null,
		c: undefined,
		d: 0,
		e: '',
		f: NaN,
		g: 1,
		h: 'a',
		i: {},
		j: [],
		k: true
	};
	
	describe('isNullOrUndefined', function () {
		_.each(falsyAndTruthy, function (val, key) {
			if (_.includes(['b', 'c'], key)) {
				it('should return true for null and undefined values', function () {
					assert.equal(_.isNullOrUndefined(val), true);
				});
			}
			else {
				it('should return false for non-null and defined values', function () {
					assert.equal(_.isNullOrUndefined(val), false);
				});
			}
		});
	});
});
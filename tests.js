var _ = require('./lodash-plus.js');
var assert = require('assert');

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

describe('lodash-plus', function () {
	describe('isFalsy', function() {
		it('should return the same values as !Boolean()', function () {
			_.each(_.values(falsyAndTruthy), function (val) {
				assert.equal(_.isFalsy(val), !Boolean(val));
			})
		});
	});
	
	describe('isTruthy', function() {
		it('should return the same values as Boolean()', function () {
			_.each(_.values(falsyAndTruthy), function (val) {
				assert.equal(_.isTruthy(val), Boolean(val));
			})
		});
	});
	
	describe('pickTruthy', function() {
		it('should pick all truthy values if one param passed in', function () {
			assert.deepEqual(
				_.pickTruthy(falsyAndTruthy),
				_.pick(falsyAndTruthy, ['g', 'h', 'i', 'j', 'k'])
			);
		});
		
		// TODO: specs needed for all pickTruthy cases
	});
});
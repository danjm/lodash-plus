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

var falsyParams = ['a', 'b', 'c', 'd', 'e', 'f'];
var truthyParams = ['g', 'h', 'i', 'j', 'k'];
var nonExistantParams = ['l', 'm', 'n'];

describe('lodash-plus', function () {
	describe('isFalsy', function() {
		_.each(_.values(falsyAndTruthy), function (val) {
			it('should return ' + !Boolean(val) + ' when called with ' + val, function () {
				assert.equal(_.isFalsy(val), !Boolean(val));
			});
		})
	});
	
	describe('isTruthy', function() {
		it('should return the same values as Boolean()', function () {
			_.each(_.values(falsyAndTruthy), function (val) {
				assert.equal(_.isTruthy(val), Boolean(val));
			})
		});
	});
});
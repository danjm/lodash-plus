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
	
	describe('pickTruthy', function() {
		describe('when one param passed in', function () {
			it('should pick all truthy values if one param passed in', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy),
					_.pick(falsyAndTruthy, truthyParams)
				);
			});
		});
		
		describe('when two params passed in and second is a string', function () {
			it('should return an empty object if no property with the string name exists', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy, ''),
					{}
				);
			});
			
			_.each(falsyParams, function (prop) {
				it('should return an empty object if the property with the string name is ' + falsyAndTruthy[prop], function () {
					assert.deepEqual(
						_.pickTruthy(falsyAndTruthy, prop),
						{}
					);
				});
			});
			
			it('should return an object containing only the property if the property with the string name is truthy', function () {
				_.each(truthyParams, function (prop) {
					assert.deepEqual(
						_.pickTruthy(falsyAndTruthy, prop),
						_.set({}, prop, falsyAndTruthy[prop])
					);
				});
			});
		});
		
		describe('when two params passed in and second is an array', function () {
			it('should return an empty object if no properties in the array exist', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy, nonExistantParams),
					{}
				);
			});
			
			it('should return an empty object if the properties are falsy', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy, falsyParams.slice(0, 3)),
					{}
				);
			});
			
			it('should return an object containing only the properties if they are truthy', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy, truthyParams.slice(0, 3)),
					_.pick(falsyAndTruthy, truthyParams.slice(0, 3))
				);
			});
			
			it('should return an object containing only the truthy params', function () {
				assert.deepEqual(
					_.pickTruthy(falsyAndTruthy, nonExistantParams.concat(truthyParams.slice(1, 4)).concat(falsyParams.slice(2, 4))),
					_.pick(falsyAndTruthy, truthyParams.slice(1, 4))
				);
			});
		});
	});
});
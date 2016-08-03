var _ = require('./lodash-plus.js');
var assert = require('assert');

var falsyAndTruthy = {
	'false': false,
	'null': null,
	'undefined': undefined,
	'0': 0,
	'empty string': '',
	'NaN': NaN,
	'1': 1,
	'\'a\'': 'a',
	'{}': {},
	'[]': [],
	'true': true
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
	
	describe('isDefined', function () {
		var testObject = {'a': true};
		var testArray = [1, 2];
		
		it('should return false when passed undefined', function () {
			assert.equal(_.isDefined(undefined), false);
		});
		
		it('should return false when passed void 0', function () {
			assert.equal(_.isDefined(void 0), false);
		});
		
		it('should return false when passed an object property that does NOT exist', function () {
			assert.equal(_.isDefined(testObject.b), false);
		});
		
		it('should return false when passed an array index that does NOT exist', function () {
			assert.equal(_.isDefined(testArray[2]), false);
		});
		
		it('should return true when passed !undefined', function () {
			assert.equal(_.isDefined(!undefined), true);
		});
		
		it('should return true when passed null', function () {
			assert.equal(_.isDefined(null), true);
		});
		
		it('should return true when passed false', function () {
			assert.equal(_.isDefined(false), true);
		});
		
		it('should return true when passed an empty string', function () {
			assert.equal(_.isDefined(''), true);
		});
		
		it('should return true when passed an object property that does exist', function () {
			assert.equal(_.isDefined(testObject.a), true);
		});
		
		it('should return true when passed an array index that does exist', function () {
			assert.equal(_.isDefined(testArray[1]), true);
		});
	});
	
	describe('isNullOrUndefined', function () {
		_.each(falsyAndTruthy, function (val, key) {
			if (_.overSome(_.isNull, _.isUndefined)(val)) {
				it('should return true when called with ' + key, function () {
					assert.equal(_.isNullOrUndefined(val), true);
				});
			}
			else {
				it('should return false when called with ' + key, function () {
					assert.equal(_.isNullOrUndefined(val), false);
				});
			}
		});
	});
	
	describe('includesAny', function () {
		describe('when called with two strings', function () {
			var searchInA = ['abc', 'def', 'ghi', 'jkl'];
			var searchInB = ['xxx', 'yyy', 'zzz'];
			
			var searchForA = ['qqqadgjqqq', 'bqeqhqk', 'qqqlifc'];
			var searchForB = ['x', 'y', 'z'];
			
			describe('and the first string contains at least one letter from the second', function () {
				it('should return true', function () {
					_.each(searchInA, function (searchInString) {
						_.each(searchForA, function (searchForString) {
							assert.equal(_.includesAny(searchInString, searchForString), true);
						});
					});
				});
			});
			
			describe('and the first string has length > 1 and contains no letters from the second with length of 1', function () {
				it('should return false', function () {
					_.each(searchInA, function (searchInString) {
						_.each(searchForB, function (searchForString) {
							assert.equal(_.includesAny(searchInString, searchForString), false);
						});
					});
				});
			});
				
			describe('and the first string contains no letters from the second, which is longer than the first', function () {
				it('should return false', function () {
					_.each(searchInB, function (searchInString) {
						_.each(searchForA, function (searchForString) {
							assert.equal(_.includesAny(searchInString, searchForString), false);
						});
					});
				});
			});
		});
		
		describe('pickTruthy', function() {
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
					
					assert.deepEqual(
						_.pickTruthy(falsyAndTruthy, 'z'),
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
				
				_.each(truthyParams, function (prop) {
					it('should return an object containing only the property if the property with the string name is truthy', function () {
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
		
		describe('when called with an array of objects and an array of strings', function () {
			// TODO: is this the behaviour we want for this case?
			var testObjects = [
				{a: true, b: null, c: 1},
				{d: false, e: NaN, f: 'a'},
				{g: true, h: undefined, i: []},
				{j: false, k: 0, l: _.noop}
			];
			
			describe('and at least one of the test objects has a property key matching one of the strings', function () {
				var matchingTestStrings = [['x', 'b', 'q'], ['g', 'l', 'c'], ['z', 'zzz', 'h']];
				it('should return true', function () {
					_.each(matchingTestStrings, function (stringArray) {
						assert.equal(_.includesAny(testObjects, stringArray), true);
					});
				});
			});
			
			describe('and none of the test objects have a property key matching one of the strings', function () {
				var unMatchingTestStrings = [['x', 'y', 'z'], ['ab', 'kl'], ['ll']];
				it('should return false', function () {
					_.each(unMatchingTestStrings, function (stringArray) {
						assert.equal(_.includesAny(testObjects, stringArray), false);
					});
				});
			});
		});
		
		describe('when called with arrays of non-object values', function () {
			_.each({
				'number': {
					first: [1, 2, 3],
					match: [4, 2, 6],
					noMatch: [7, 8, 9]
				},
				'string': {
					first: ['a', 'b', 'c'],
					match: ['d', 'b', 'f'],
					noMatch: ['g', 'h', 'i']
				},
				'assorted': {
					first: [true, NaN, undefined],
					match: [false, 1, NaN],
					noMatch: [null, 0, '1']
				}
			}, function (config, arrayType) {
				describe('and the arrays are arrays of ' + arrayType + ' values and at least one element of each are equal', function () {
					it('should return true', function () {
						assert.equal(_.includesAny(config.first, config.match), true);
					});
				});
				
				describe('and the arrays are arrays of ' + arrayType + ' values and no elements of either are equal', function () {
					it('should return false', function () {
						assert.equal(_.includesAny(config.first, config.noMatch), false);
					});
				});
			});
		});
		
		describe('when searching for an array of values within an object', function () {
			_.each({
				'number': {
					object: {a: 1, b: 2, c:3},
					match: [4, 2, 6],
					noMatch: [7, 8, 9]
				},
				'string': {
					object: {a: 'a', b: 'b', c:'c'},
					match: ['d', 'b', 'f'],
					noMatch: ['g', 'h', 'i']
				},
				'assorted': {
					object: {a: true, b: NaN, c:undefined},
					match: [false, 1, NaN],
					noMatch: [null, 0, '1']
				}
			}, function (config, arrayType) {
				describe('and the array is an array of ' + arrayType + ' values with at least one element in the object', function () {
					it('should return true', function () {
						assert.equal(_.includesAny(config.object, config.match), true);
					});
				});
				
				describe('and the array is an array of ' + arrayType + ' values with no elements in the object', function () {
					it('should return false', function () {
						assert.equal(_.includesAny(config.object, config.noMatch), false);
					});
				});
			});
		});
	});
	
	describe('disjoint', function () {
		_.each({
			'don\'t': {
				'strings': {
					A: ['a', 'b', 'c'],
					B: ['d', 'e', 'f']
				},
				'numbers': {
					A: [1, 2, 3],
					B: [4, 5, 6]
				},
				'booleans': {
					A: [false, false, false],
					B: [true, true, true]
				},
				'mixed types': {
					A: [false, null, [2], 'the'],
					B: ['th', true, [null], 2]
				}
			},
			'do': {
				'strings': {
					A: ['a', 'b', 'c'],
					B: ['d', 'e', 'a']
				},
				'numbers': {
					A: [1, 4, 3],
					B: [4, 5, 6]
				},
				'booleans': {
					A: [false, false, false],
					B: [true, false, true]
				},
				'mixed types': {
					A: [false, null, [2], 'the'],
					B: ['th', true, null, 2]
				}
			}
		}, function (config, doOrDont) {
			var result = doOrDont !== 'do';
			_.each(config, function (arrays, type) {
				describe('when called with arrays of ' + type + ' that ' + doOrDont + ' intersect', function () {
					it('should return ' + result, function () {
						assert.equal(_.disjoint(arrays.A, arrays.B), result);
					});
				});
			});
		});
	});
	
	describe('isEvery', function () {
		var testPredicates = {
			moreThanFive: function (obj) {return _.size(obj) > 5;},
			endsWithX: function (str) {return _.endsWith(str, 'x');}
		};
		_.each({
			'isString': {
				True: ['a', 'b', 'c', 'd'],
				False: ['a', 'b', ['c'], 'd']
			},
			'isArray': {
				True: [[1, 2], [3, 4], [true], [null, false]],
				False: [[1, 2], {'0': 3, '1': 4}, [true], [null, false]]
			},
			'isNumber': {
				True: [-1, 0, 1.5, 10000000],
				False: [-1, 0, '0', 1.5, 10000000]
			},
			'isPlainObject': {
				True: [{a: 1}, {b: {c: 'd'}}, {e: [123]}, {}],
				False: [{a: 1}, {b: {c: 'd'}}, [123], {}]
			},
			'moreThanFive': {
				True: [{a: 1, b: 2, c: 3, d: 4, e: 5, f: 6}],
				False: [{a: 1, b: 2, c: 3, d: 4, e: 5}]
			},
			'endsWithX': {
				True: ['abcx', 'xyzx', '00000x', 'x'],
				False: ['abcx', 'xyzx', '00000xy', 'x']
			}
		}, function (expectations, funcName) {
			var func = _.isEvery(_[funcName] || testPredicates[funcName]);
			describe('when called with the ' + funcName + ' function', function () {
				it('should return true if every array element returns true when passed to the predicate', function () {
					assert.equal(func(expectations.True), true);
				});
				
				it('should return false if any array element returns false when passed to the predicate', function () {
					assert.equal(func(expectations.False), false);
				});
			});
			
			var stringAfterIs = _.trimStart(funcName, 'is');
			describe('when called with the string ' + stringAfterIs, function () {
				if (_[funcName]) {
					it('should return true if every array element returns true when passed to the corresponding lodash "is" function', function () {
						assert.equal(_.isEvery(stringAfterIs)(expectations.True), true);
					});
					
					it('should return false if any array element returns false when passed to the corresponding lodash "is" function', function () {
						assert.equal(_.isEvery(stringAfterIs)(expectations.False), false);
					});
				}
				// else {
				// 	it('should throw an error if the string does not correspond to a lodash "is" function', function () {
				// 		assert.throws(function () {_.isEvery(stringAfterIs)(expectations.True)}, Error);
				// 	});
				// }
			});
		});
	});
	
	describe('hasAny', function () {
		var testObject = {a: 1, b: false, c: undefined, d: {}};
		
		describe('when the object has keys matching at least one array string', function () {
			var matchingArray = ['aa', 'bb', 'c', 'dd'];
			it('should return true', function () {
				assert.equal(_.hasAny(testObject, matchingArray), true);
			});
		});
		
		describe('when the object has no keys matching any array string', function () {
			var unMatchingArray = ['aa', 'bb', 'cc', 'dd'];
			it('should return false', function () {
				assert.equal(_.hasAny(testObject, unMatchingArray), false);
			});
		});
	});
	
	describe('hasAll', function () {
		var testObject = {a: true, b: null, c: 1, d: false, e: NaN, f: 'a'};
		var trueCases = [['a', 'b', 'd'], ['d', 'e', 'f'], ['c'], _.keys(testObject)];
		var falseCases = [['a', 'b', 'm'], ['g', 'h', 'i'], ['z'], _.keys(testObject).concat('q')];
		
		describe('when the object has a key that matches each string in the array', function () {
			it('should return true', function () {
				_.each(trueCases, function (array) {
					assert.equal(_.hasAll(testObject, array), true);
				});
			});
		});
		
		describe('when the there is a string in the array that does not match an object key', function () {
			it('should return false', function () {
				_.each(falseCases, function (array) {
					assert.equal(_.hasAll(testObject, array), false);
				});
			});
		});
	});
	
	describe('isIntable', function () {
		var intables = [-18, 0, 19, '-18', '0', '19', [2], ['2'], -0, '-0', 1.0, -1.0, '1.0', '-1.0', ['-0.0']];
		var nonIntables = [-18.1, null, 19.5, {0:1, length:1}, undefined, [null], '-18.5', [], {}, 'a', NaN, false, [1, 3], ['1', '3'], {1: 1}, [[2]], ['-0.5']];
		
		_.each(intables, function (val) {
			it('should return true when passed the ' + typeof val + ' ' + val, function () {
				assert.equal(_.isIntable(val), true);
			});
		});
		
		_.each(nonIntables, function (val) {
			it('should return false when passed the ' + typeof val + ' ' + val, function () {
				assert.equal(_.isIntable(val), false);
			});
		});
	});
	
	describe('argsLength', function () {
		describe('when callback is not a predicate', function () {
			var callbacks = [
				_.identity,
				_.partial(_.add, 10),
				_.partial(_.repeat, 'o')
			];
			
			var funcs = _.map(callbacks, _.argsLength);
			
			it('should use the number of arguments in the callback', function () {
				assert.equal(funcs[0]('a', false), 2);
				assert.equal(funcs[1]('a', false, null, 1000), 14);
				assert.equal(funcs[2](1, 2, 3, 4, 5), 'ooooo');
			});
		});
		
		describe('when callback is a predicate', function () {
			var predicates = [
				_.partial(_.lt, 1),
				_.partial(_.isEqual, 4),
				_.isFalsy
			];
			
			var funcs = _.map(predicates, _.argsLength);
			
			it('should return true if the number of arguments would return true when passed to the predicate', function () {
				assert.equal(funcs[0]('a', false), true);
				assert.equal(funcs[1]('a', false, null, 1000), true);
				assert.equal(funcs[2](), true);
			});
			
			it('should return false if the number of arguments would return false when passed to the predicate', function () {
				assert.equal(funcs[0]('a'), false);
				assert.equal(funcs[0](), false);
				assert.equal(funcs[1]('a', null, 1000), false);
				assert.equal(funcs[2]({}, []), false);
			});
		});
		
		describe('when no callback provided', function () {
			it('should return a function that returns the number of args', function () {
				assert.equal(_.argsLength()(1, 2, 3), 3);
				assert.equal(_.argsLength()(true, false, null, undefined, NaN), 5);
				assert.equal(_.argsLength()(), 0);
				assert.equal(_.argsLength().apply(null, _.range(100)), 100);
			});
		});
	});
	
	describe('fullSize', function () {
		var obj1 = {a: 1, b: 2, c: 3};
		var obj2 = {a: {x: 1}, b: {x: 2}, c: {x: 3}};
		var obj3 = {a: {b: {c: {d: {e: {f: {g: {h: 10}}}}}}}};
		var obj4 = {x: obj1, y: obj2, z: obj3};
		
		_.each({
			'when an object has first level properties only': {
				arg: obj1,
				expectedResult: 3,
				should: 'return the number of properties'
			},
			'when an object has first and second level properties': {
				arg: obj2,
				expectedResult: 6,
				should: 'return the sum of first and second level properties'
			},
			'when an object has deeply nested properties': {
				arg: obj3,
				expectedResult: 8,
				should: 'return a count for each propery on the path'
			},
			'when an object has multiple deeply nested properties': {
				arg: obj4,
				expectedResult: 20,
				should: 'return a count for each propery on every path'
			}
		}, function (config, desc) {
			describe(desc, function () {
				it(config.should, function () {
					assert.equal(_.fullSize(config.arg), config.expectedResult)
				});
			});
		});
	});
	
	describe('extendAll', function () {
		// TODO: simplify these spec and add cases for empty collection arguments
			// also add separate tests for checking that collection is modified
		var collection = [{a: 1}, {b: 2}, {c: 3}];
		var source1 = {d: 4};
		var source2 = {e: {f: 5}, g: {h: 5}};
		var source3 = {a: 10, b: 10, c: 10};
		var source4 = {g: {h: true}};
		var source5 = {d: null, g: {z: false}};
		var source6 = 123;
		
		var extendAllClone = _.spread(_.collCloner(_.extendAll));
		var mapClone = _.collCloner(_.map)
		
		_.each({
			'with one source with one non-deep property': {
				collectionAndSources: [collection, source1],
				resultExpectationModifier: function (obj) {
					return _.set(obj, 'd', 4);
				}
			},
			'with one source with two deep properties': {
				collectionAndSources: [collection, source2],
				resultExpectationModifier: function (obj) {
					_.set(obj, 'e.f', 5);
					_.set(obj, 'g.h', 5);
					return obj;
				}
			},
			'with one source with three non-deep properties': {
				collectionAndSources: [collection, source3],
				resultExpectationModifier: _.constant(source3)
			},
			'with two sources with a deep properties': {
				collectionAndSources: [collection, source2, source4],
				resultExpectationModifier: function (obj) {
					_.set(obj, 'e.f', 5);
					_.set(obj, 'g.h', true);
					return obj;
				}
			},
			'with three sources one non-deep and deep properties': {
				collectionAndSources: [collection, source1, source2, source5],
				resultExpectationModifier: function (obj) {
					_.set(obj, 'd', null);
					_.set(obj, 'e.f', 5);
					_.set(obj, 'g.z', false);
					return obj;
				}
			}
		}, function (config, desc) {
			describe('when called with ' + desc, function () {
				it('should return the collection with each object modified to include the sources', function () {
					assert.deepEqual(extendAllClone(config.collectionAndSources), mapClone(collection, config.resultExpectationModifier));
				});
			});
		});
		
		it('should throw an error if called with any value that is not a plain object', function () {
			assert.throws(function () {extendAllClone([collection, source1, source2, source6])}, Error);
		});
	});
	
	describe('collCloner', function () {
		// TODO: rewrite
		var collection = [{a: 1}, {b: 2}, {c: 3}];
		var collCloneMappedCollection = _.collCloner(_.map)(collection, function (obj) {
			return _.set(obj, 'd', 4);
		});
		var expectedMappedCollection = [{a: 1, d: 4}, {b: 2, d: 4}, {c: 3, d: 4}];
		var expectedUnMappedCollection = [{a: 1}, {b: 2}, {c: 3}];
		
		it('should return a function that has the same result as the callback', function () {
			assert.deepEqual(collCloneMappedCollection, expectedMappedCollection);
		});
		
		it('should not modify the passed in collection', function () {
			assert.deepEqual(collection, expectedUnMappedCollection);
		});
	});
	
	describe('allPaths', function () {
		var testObj1 = {a: {x: 1, y: 2, z: 3}, b: {x: 1, y: 2, z: 3}, c: {x: 1, y: 2, z: {zz: 3, zzz: {abc: 10}}}};
		var testObj2 = {a: {b: {c: {d: {e: {f: {g: 1}}}}}}};
		var testObj3 = {a: 1, b: 2, c: 3, d: undefined, e: undefined};
		var expectedPaths1 = [['a'], ['b'], ['c'], ['a', 'x'], ['a', 'y'], ['a', 'z'], ['b', 'x'], ['b', 'y'], ['b', 'z'], ['c', 'x'], ['c', 'y'], ['c', 'z'], ['c', 'z', 'zz'], ['c', 'z', 'zzz'], ['c', 'z', 'zzz', 'abc']];
		var expectedPaths2 = [['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'c', 'd', 'e', 'f'], ['a', 'b', 'c', 'd', 'e', 'f', 'g']];
		var expectedPaths3 = [['a'], ['b'], ['c'], ['d'], ['e']];
		
		_.each({
			'when an object has many properties and some properties have nested properties': {
				testObject: testObj1,
				expectedResult: expectedPaths1
			},
			'when an object has a very deeply nested property': {
				testObject: testObj2,
				expectedResult: expectedPaths2
			},
			'when an object has only first level properties and some of them point to undefined values': {
				testObject: testObj3,
				expectedResult: expectedPaths3
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return an array containing all exact paths to all nested properties', function () {
					assert.deepEqual(_.sortBy(_.allPaths(config.testObject)), _.sortBy(config.expectedResult));
				});
			});
		});
	});
	
	describe('getAll', function () {
		var testObj1 = {a: {x: 1, y: 2, z: 3}, b: {x: 1, y: 2, z: 3}, c: {x: 1, y: 2, z: {zz: 3, zzz: {abc: 10}}}};
		var testObj2 = {a: {b: {c: {d: {e: {f: {g: 1}}}}}}};
		var testObj3 = {a: 1, b: 2, c: 3, d: undefined, e: undefined};
		
		_.each({
			'when an object has many properties and some properties have nested properties': {
				testParams: [testObj1, ['c', 'b.x', 'a.c', 'a.z'], null],
				expectedResult: [testObj1.c, testObj1.b.x, null, testObj1.a.z]
			},
			'when an object has a very deeply nested property': {
				testParams: [testObj2, ['a', 'a.b.c', 'a.b.c.d.e.f.g', 'a.b.c.d.e.f.g.h'], 2],
				expectedResult: [testObj2.a, testObj2.a.b.c, testObj2.a.b.c.d.e.f.g, 2]
			},
			'when an object has only first level properties and some of them point to undefined values': {
				testParams: [testObj3, ['a', 'b', 'd', 'f', 'a.z']],
				expectedResult: [testObj3.a, testObj3.b, testObj3.d, undefined, undefined]
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return all objects at the requested path or default if non-existant', function () {
					assert.deepEqual(_.spread(_.getAll)(config.testParams), config.expectedResult);
				});
			});
		});
	});
	
	describe('getFirst', function () {
		var testObj1 = {a: {x: 1, y: 2, z: 3}, b: {x: 1, y: 2, z: 3}, c: {x: 1, y: 2, z: {zz: 3, zzz: {abc: 10}}}};
		var testObj2 = {a: {b: {c: {d: {e: {f: {g: 1}}}}}}};
		var testObj3 = {a: 1, b: 2, c: 3, d: undefined, e: undefined};
		
		_.each({
			'when an object has many properties and some properties have nested properties': {
				testParams: [testObj1, ['d', 'b.q', 'a.z', 'a.x'], null],
				expectedResult: testObj1.a.z
			},
			'when an object has a very deeply nested property': {
				testParams: [testObj2, ['a.c.b', 'a.d.e', 'a.b.c.d.e.f', 'a.b.c'], 2],
				expectedResult: testObj2.a.b.c.d.e.f
			},
			'when an object has only first level properties and some of them point to undefined values': {
				testParams: [testObj3, ['z', 'x'], 5],
				expectedResult: 5
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return the value of the first defined property in the array', function () {
					assert.deepEqual(_.spread(_.getFirst)(config.testParams), config.expectedResult);
				});
			});
		});
	});
	
	describe('setDefinite', function () {
		// TODO: rewrite
		var something = {};
		var testObj = {a: 1, b: {c: 3}};
		_.setDefinite(testObj, 'd', 4);
		_.setDefinite(testObj, 'b.c', 2);
		_.setDefinite(testObj, 'x.y.z', 10);
		_.setDefinite(testObj, 'd', undefined);
		_.setDefinite(testObj, 'g.h', something.orOther);
		_.setDefinite(testObj, 'b.e', _.get(something, 'a'));
		
		var expectedResult = _.merge({}, testObj, {b: {c: 2}, d: 4, x: {y: {z: 10}}});
		
		it('should call set with defined values and ignore cases with undefined values', function () {
			assert.deepEqual(testObj, expectedResult);
		});
	});
	
	describe('eachUntil', function () {
		// TODO: rewrite
		var testArray = [2, 4, 6, 8, 10, 12, 14, 16, 18];
		var testObj = {a: 'at', b: 'bat', c: 'cast', d: 'dusty', e: 'everywhere'};
		var testCollection1 = [{a: 1, c: 1}, {a: 2, x: false}, {a: 3, b: 3}, {a: 4}, {b: 5, z: true}];
		var testCollection2 = [{xyz: 5}, {xyz: 6}, {xyz: 7}, null, {xyz: 8}];
		
		it('should iterate over collection until the predicate returns true', function () {
			// TODO: _.push
			var pushFunction = function (val) {
				results.push(val);
			};
			// TODO: functional refactor of below
			// TODO: _.each({scenarios}) approach to tests
			var results = [];
			_.eachUntil(testArray, pushFunction, _.partial(_.lt, 10));
			assert.deepEqual(results, _.filter(testArray, _.partial(_.gt, 12)));
			
			results = [];
			_.eachUntil(testObj, pushFunction, function (val) {return val.length > 4;});
			assert.deepEqual(results, _.filter(testObj, function (val) {return val.length < 5;}));
			
			results = [];
			_.eachUntil(testCollection1, pushFunction, function (val) {return _.keys(val).length < 2;});
			assert.deepEqual(results, _.slice(_.filter(testCollection1, function (val) {return _.keys(val).length > 1;}), 0, 3));
			
			results = [];
			_.eachUntil(testCollection2, pushFunction, _.isFalsy);
			assert.deepEqual(results, _.slice(_.filter(testCollection2), 0, 3));
		});
	});
	
	describe('pathsEqual', function () {
		// TODO: rewrite
		var obj1 = {a: 1, b: 2, c: 3, d: {e: 5, f: 6}, g: {h: {i: {j: 100}, z: {x: true}}}, k: {l: {m: {n: 200}}}, abc: {a: {x: 11, y: null, z: 33}, b: {x: 44, y: undefined, z: 66}, c: {x: 77, y: false, z: 99}}, zzz: undefined, qwe: 22};
		var obj2 = {a: 1, b: 22, d: {e: 5, f: 7}, g: {h: {z: {x: true, y: false}}}, k: {}, abc: {a: {x: '11', y: null, z: 333, qqq: {q: true}}, b: {x: '44', y: undefined, z: 666}, c: {x: '77', y: false, z: 999}}};
		
		// should return false when the values are equal but the paths are differnt
		
		it('should return true when the values at the paths are equal', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'a'], [obj2, 'a']), true);
		});
		
		it('should work for deeply nested paths', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'g.h.z.x'], [obj2, 'g.h.z.x']), true);
		});
		
		it('should return false when the value at one path is defined and the other is not', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'zzz'], [obj2, 'zzz']), false);
		});
		
		it('should return false when the values at the paths are both defined but not equal', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'b'], [obj2, 'b']), false);
		});
		
		it('should return true when the values at the paths are equal, but the paths are different', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'qwe'], [obj2, 'b']), true);
		});
		
		it('should work for deeply nested paths when the paths are different', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'g.h.z.x'], [obj2, 'abc.a.qqq.q']), true);
		});
		
		it('should return false when the value at one path is defined and the other is not and the paths are different', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'zzz'], [obj2, 'zzzzz']), false);
		});
		
		it('should return false when the values at the paths are both defined but not equal and the paths are different', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'd.g'], [obj2, 'g.y']), false);
		});
		
		describe('and when the same path shorthand is used', function () {
			it('should return true when the values at the path are equal', function () {
				assert.deepEqual(_.pathsEqual(obj1, obj2, 'a'), true);
			});
			
			it('should work for a deeply nested path', function () {
				assert.deepEqual(_.pathsEqual(obj1, obj2, 'g.h.z.x'), true);
			});
			
			it('should return false when one of the values at the path is defined and the other is not', function () {
				assert.deepEqual(_.pathsEqual(obj1, obj2, 'zzz'), false);
			});
			
			it('should return false when the values at the path are both defined but not equal', function () {
				assert.deepEqual(_.pathsEqual(obj1, obj2, 'b'), false);
			});
		});
	});
	
	describe('innerJoin', function () {
		// TODO: check proper handling of 'abc.b'
		// TODO: rewrite
		var obj1 = {a: 1, b: true, c: null, d: 'test', e: {}};
		var obj2 = {a: '1', b: false, c: null, d: 'test', e: {}};
		var obj3 = {a: 1, b: {c: '2'}, d: {e: {f: true, g: false}}};
		var obj4 = {a: '1', b: {c: 2}, d: {e: {f: false, g: true}}};
		var obj5 = {a: 1, b: 2, c: 3, d: {e: 5, f: 6}, g: {h: {i: {j: 100}, z: {x: true}}}, k: {l: {m: {n: 200}}}, zzz: undefined};
		var obj6 = {a: 1, b: 22, d: {e: 5, f: 7}, g: {h: {z: {x: true, y: false}}}, k: {}};
		var obj7 = {xyz: 10};
		var obj8 = {xyz: 10};
		var obj9 = {a: {b: {c: {d: {e: {f: {g: {h: undefined}, s: null}, r: false}, q: {ee: 1}}, p: {}}, o: 'o'}, n: true}, m: 10};
		var obj10 = {a: {b: {c: {d: {e: {f: {g: {h: undefined}, s: false}, r: 0}}, p: {a: 1}}, o: 'O'}, n: 1}};
		var obj11 = {};
		
		var expected1and2Union = {c: null, d: 'test', e: {}};
		var expected3and4Union = {};
		var expected5and6Union = {a: 1, d: {e: 5}, g: {h: {z: {x: true}}}};
		var expected9and10Union = {a: {b: {c: {d: {e: {f: {g: {h: undefined}}}}}}}};
		var expectedUnionWith11 = {};
		
		it('should return a copy of one of the objects when both are identical', function () {
			assert.deepEqual(_.innerJoin(obj7, obj8), obj7);
		});
		
		it('should should work for deeply nested paths that resolve to undefined', function () {
			assert.deepEqual(_.innerJoin(obj7, obj8), obj7);
		});
		
		it('should return an object of all identical path-property pairs between the two objects', function () {
			assert.deepEqual(_.innerJoin(obj1, obj2), expected1and2Union);
		});
		
		it('should return an empty object if there are no identical path-property pairs between the two objects', function () {
			assert.deepEqual(_.innerJoin(obj3, obj4), expected3and4Union);
		});
		
		it('should return an object of all identical path-property pairs between two complex objects with deep paths', function () {
			assert.deepEqual(_.innerJoin(obj5, obj6), expected5and6Union);
		});
		
		it('should return an empty object when any object is joined with an empty object', function () {
			assert.deepEqual(_.innerJoin(obj2, obj11), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj4, obj11), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj6, obj11), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj8, obj11), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj10, obj11), expectedUnionWith11);
		});
		
		it('should return an empty object when an empty object is joined with any object', function () {
			assert.deepEqual(_.innerJoin(obj11, obj2), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj11, obj4), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj11, obj6), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj11, obj8), expectedUnionWith11);
			assert.deepEqual(_.innerJoin(obj11, obj10), expectedUnionWith11);
		});
	});
	
	describe('filtration', function () {
		// TODO: rewrite
		var testCollection1 = [
			{a: 1, b: '_.noop', z: [true, false], second: 10, a2: 't', a3: 't'},
			{a: 2, b: _.noop, z: [true, false], second: '10', a2: 't', a3: 't'},
			{a: 3, b: '_.noop', z: [true, false], second: 10, a2: 't', a3: 't'},
			{a: 4, b: _.noop, second: 10, a3: 't', a4: 't', a5: 't'},
			{a: 5, b: '_.noop', z: [true, false], second: 10, a2: 't', a3: 't'},
			{a: 6, b: _.noop, z: [true, false], second: 10, a2: 't', a3: 't'},
			{a: 7, b: _.noop, second: 10, a3: 't', a4: 't', a5: 't'},
			{a: 8, b: _.noop, z: [true, false], a2: 't', a3: 't', a4: 't'},
			{a: 9, b: _.noop, z: [true, false], second: 10, a2: 't'},
			{a: 10, b: _.noop, z: [true, false], second: 10, a2: 't', a3: 't'}
		];
		var testFilterArrays = [
			function (obj) {
				return _.some(_.values(obj), _.isFunction);
			},
			function (obj) {
				return _.keys(obj).length > 5;
			},
			function (obj) {
				return _.isEqual(obj.z, [true, false]);
			},
			function (obj) {
				return _.filter(_.values(obj), _.isNumber).length >= 2;
			}
		];
		var expectedResult = _.filter(testCollection1, function (obj) {
			return obj.a === 6 || obj.a === 10;
		});
		it('should use all functions in the array as filters', function () {
			assert.deepEqual(_.filtration(testCollection1, testFilterArrays), expectedResult)
		});
	});
	
	describe('applyToNested', function () {
		// TODO: rewrite
		var testCollection1 = [
			{a: 10, x: 'a', y: true},
			{a: 20, x: 'b', y: true},
			{a: 30, x: 'a', y: true},
			{a: 40, x: 'a', y: false}
		];
		var testObj1 = {a: 10, b: {c: 20, d: {x: true, y: false}, e: 'q'}};
		
		var applyToNestedFilter = _.applyToNested(_.filter, 'b', 1);
		var applyToNestedIsFalsy = _.applyToNested(_.isFalsy, 'y');
		var applyToNestedSet = _.applyToNested(_.set, 'b.d.y', 2);
		var applyToNestedPick = _.applyToNested(_.pick, 'b', 0);
		
		var expectedFilteredCollection1 = _.filter(testCollection1, function (obj) {
			return (obj.a/10) % 2 === 1;
		});
		var expectedFilteredCollection2 = [testCollection1[3]];
		var expectedSetObject = {a: '17', z: false};
		var expectedPickedObject = {c: 20, e: 'q'};
		
		it('should use the object at the specified path', function () {
			var result = applyToNestedFilter(testCollection1, {a: 20, b: {x: 'a', y: true}});
			assert.deepEqual(result, expectedFilteredCollection1);
			result = _.filter(testCollection1, applyToNestedIsFalsy);
			assert.deepEqual(result, expectedFilteredCollection2);
			result = applyToNestedSet({a: '17'}, 'z', testObj1);
			assert.deepEqual(result, expectedSetObject);
			result = applyToNestedPick(testObj1, ['c', 'e']);
		});
	});
	
	describe('setBySelf', function () {
		var testObj1 = {a: 1, b: 2, c: 3};
		var testObj2 = {a: 1, b: {c: {d: 2}}};
		var testObj3 = {a: {b: {c: 1}}, d: {e: {f: 2}}};
		var testObj4 = {a: {b: {c: 1, d: 2}}};
		
		_.each({
			'when setting an existing first level property to an existing first level property': {
				object: testObj1,
				atPath: 'a',
				toPath: 'c',
				expectedResult: {a: 3, b: 2, c: 3}
			},
			'when setting a non-existing first level property to an existing first level property': {
				object: testObj1,
				atPath: 'd',
				toPath: 'c',
				expectedResult: {a: 1, b: 2, c: 3, d: 3}
			},
			'when setting an existing first level property to a non-existing first level property': {
				object: testObj1,
				atPath: 'a',
				toPath: 'd',
				expectedResult: {a: undefined, b: 2, c: 3}
			},
			'when setting a non-existing first level property to a non-existing first level property': {
				object: testObj1,
				atPath: 'd',
				toPath: 'e',
				expectedResult: {a: 1, b: 2, c: 3, d: undefined}
			},
			'when setting an existing first level property to an existing nested property on a different path': {
				object: testObj2,
				atPath: 'a',
				toPath: 'b.c.d',
				expectedResult: {a: 2, b: {c: {d: 2}}}
			},
			'when setting a non-existing first level property to an existing nested property on a different path': {
				object: testObj2,
				atPath: 'e',
				toPath: 'b.c.d',
				expectedResult: {a: 1, b: {c: {d: 2}}, e: 2}
			},
			'when setting an existing first level property to a non-existing nested property on a different path': {
				object: testObj2,
				atPath: 'a',
				toPath: 'b.c.x',
				expectedResult: {a: undefined, b: {c: {d: 2}}}
			},
			'when setting an existing first level property to an existing nested property on the same path': {
				object: testObj2,
				atPath: 'b',
				toPath: 'b.c.d',
				expectedResult: {a: 1, b: 2}
			},
			'when setting an existing first level property to a non-existing nested property on the same path': {
				object: testObj2,
				atPath: 'a',
				toPath: 'a.m.n',
				expectedResult: {a: undefined, b: {c: {d: 2}}}
			},
			'when setting a non-existing first level property to a non-existing nested property on the same path': {
				object: testObj2,
				atPath: 'e',
				toPath: 'e.f',
				expectedResult: {a: 1, b: {c: {d: 2}}, e: undefined}
			},
			'when setting an existing nested property to an existing first level property': {
				object: testObj2,
				atPath: 'b.c.d',
				toPath: 'a',
				expectedResult: {a: 1, b: {c: {d: 1}}}
			},
			'when setting a non-existing nested property to an existing first level property': {
				object: testObj2,
				atPath: 'x.c.d',
				toPath: 'a',
				expectedResult: {a: 1, b: {c: {d: 2}}, x: {c: {d: 1}}}
			},
			'when setting an existing nested property to a non-existing first level property': {
				object: testObj2,
				atPath: 'b.c.d',
				toPath: 'e',
				expectedResult: {a: 1, b: {c: {d: undefined}}}
			},
			'when setting an existing nested property to an existing nested property on a different path': {
				object: testObj3,
				atPath: 'a.b.c',
				toPath: 'd.e.f',
				expectedResult: {a: {b: {c: 2}}, d: {e: {f: 2}}}
			},
			'when setting a non-existing nested property to an existing nested property on a different path': {
				object: testObj3,
				atPath: 'a.x.y',
				toPath: 'd.e.f',
				expectedResult: {a: {b: {c: 1}, x: {y: 2}}, d: {e: {f: 2}}}
			},
			'when setting a non-existing nested property to a non-existing nested property on a different path': {
				object: testObj3,
				atPath: 'a.x.y',
				toPath: 'd.e.g',
				expectedResult: {a: {b: {c: 1}, x: {y: undefined}}, d: {e: {f: 2}}}
			},
			'when setting an existing nested property to an existing nested property on the same path': {
				object: testObj3,
				atPath: 'a.b',
				toPath: 'a.b.c',
				expectedResult: {a: {b: 1}, d: {e: {f: 2}}}
			}
		}, function (config, desc) {
			var result = _.setBySelf(_.cloneDeep(config.object), config.atPath, config.toPath)
			it('should set the property path of the first arg to the value at the second path', function () {
				assert.deepEqual(result, config.expectedResult);
			});
		});
	});
	
	describe('overArg', function () {
		_.each({
			'when func has no parameters': {
				createdFunc: _.overArg(_.constant(2), _.toString, 0),
				calledWith: [[5]],
				expectedResult: 2
			},
			'when func has one parameter': {
				createdFunc: _.overArg(_.head, _.reverse),
				calledWith: [[1, 2, 3]],
				expectedResult: 3
			},
			'when func has multiple parameters and transformed arg is an object': {
				createdFunc: _.overArg(_.filter, _.partialRight(_.pick, ['a', 'd', 'e']), 0),
				calledWith: [{a:1, b:2, c:0, d:4, e:5}, function (val) {return val % 2 === 0;}],
				expectedResult: [4]
			},
			'when func has multiple parameters and transformed arg is a function': {
				createdFunc: _.overArg(_.reject, _.negate, 1),
				calledWith: [[0, 11, 5, 16, 2, 22, 10, 1, 100], function (val) {return val > 10;}],
				expectedResult: [11, 16, 22, 100]
			},
			'when func has multiple parameters and transformed arg is a number': {
				createdFunc: _.overArg(_.add, function (num) {return num * 2;}, 1),
				calledWith: [5, 6],
				expectedResult: 17
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should transform the param as expected', function () {
					assert.deepEqual(config.createdFunc.apply(null, config.calledWith), config.expectedResult);
				});
			});
		});
	});
	
	describe('arrayWrap', function () {
		_.each({
			'when called on a number': {
				input: 2,
				expectedResult: [2]
			},
			'when called on an array': {
				input: [true, [null, 's'], false],
				expectedResult: [[true, [null, 's'], false]]
			},
			'when called on null': {
				input: null,
				expectedResult: [null]
			},
		}, function (config, desc) {
			describe(desc, function () {
				it('should return the input inside an array', function () {
					assert.deepEqual(_.arrayWrap(config.input), config.expectedResult);
				});
			});
		});
	});
	
	describe('isBare', function () {
		_.each({
			'when value is undefined': {
				val: undefined,
				expectedResult: true
			},
			'when value is empty object': {
				val: {},
				expectedResult: true
			},
			'when value is an object with all properties pointing to undefined or empty objects': {
				val: {a: undefined, b: {}, c: {}, d: undefined},
				expectedResult: true
			},
			'when value is an object with some properties pointing to undefined or empty objects': {
				val: {a: undefined, b: {}, c: [1], d: undefined, e: null},
				expectedResult: false
			},
			'when value is an object with all properties pointing to defined values': {
				val: {a: false, b: 0, c: ''},
				expectedResult: false
			},
			'when value is an object with multiple properties pointing to objects containing undefined or empty objects': {
				val: {a: {a: undefined, c: {}, d: undefined}, b: {a: undefined, b: {}, c: {}}, c: {b: {}, c: {}, d: undefined}},
				expectedResult: true
			},
			'when value is an object with a deeply nested path resolving to undefined': {
				val: {a: {b: {c: {d: {e: {f: {g: {h: undefined}}}}}}}},
				expectedResult: true
			},
			'when value is an object with a deeply nested path resolving to an empty object': {
				val: {a: {b: {c: {d: {e: {f: {g: {h: {}}}}}}}}},
				expectedResult: true
			},
			'when value is an object with one deeply nested path resolving to undefined and another to defined': {
				val: {a: {b: {c: {d: {e: {f: {g: {h: undefined}}}}}}}, x: {b: {c: {d: {e: {f: {g: {h: 11}}}}}}}},
				expectedResult: false
			},
			'when value is an object with a deeply nested object containing an empty object, an undefined and a defined property': {
				val: {a: {b: {c: {d: {e: {f: {g: {h: undefined, i: {}, j: 'x'}}}}}}}},
				expectedResult: false
			},
			'when value is a number': {
				val: 2,
				expectedResult: false
			},
			'when value is a string': {
				val: 'undefined',
				expectedResult: false
			},
			'when value is null': {
				val: null,
				expectedResult: false
			},
			'when value is false': {
				val: false,
				expectedResult: false
			},
			'when value is an empty function': {
				val: function () {},
				expectedResult: false
			},
			'when value is an object containing nulls': {
				val: {a: null, b: null},
				expectedResult: false
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return ' + config.expectedResult, function () {
					assert.equal(_.isBare(config.val), config.expectedResult);
				});
			});
		});
	});
	
	describe('overTern', function () {
		_.each({
			'if created function is passed 1 arguments and cond returns true': {
				createdFunc: _.overTern(_.isString, _.lowerCase, _.size),
				inputs: ['SNAKE'],
				expectedResult: 'snake'
			},
			'if created function is passed 3 arguments and cond returns true': {
				createdFunc: _.overTern(_.partialRight(_.every, _.isNumber), _.reduce, _.orderBy),
				inputs: [[4, 5, 6], function (sum, val) {return sum + val;}, -1],
				expectedResult: 14
			},
			'if created function is passed 1 arguments and cond returns false': {
				createdFunc: _.overTern(_.isString, _.lowerCase, _.size),
				inputs: [[1, true, {}]],
				expectedResult: 3
			},
			'if created function is passed 3 arguments and cond returns false': {
				createdFunc: _.overTern(_.partialRight(_.every, _.isNumber), _.reduce, _.orderBy),
				inputs: [[4, 5, 6], function (val) {return val % 2;}, ['asc']],
				expectedResult: [4, 6, 5]
			},
			'if cond returns true and arguments are not used': {
				createdFunc: _.overTern(_.isTruthy, _.constant(100), _.constant(-1)),
				inputs: [1, 2, 3],
				expectedResult: 100
			},
			'if cond returns false and arguments are not used': {
				createdFunc: _.overTern(_.isTruthy, _.constant(100), _.constant(-1)),
				inputs: null,
				expectedResult: -1
			},
			'if the func is created with only two arguments and cond returns true': {
				createdFunc: _.overTern(_.partialRight(_.has, 'c'), _.partialRight(_.get, 'c')),
				inputs: [{'a': 1, 'z': 10, 'c': 100}],
				expectedResult: 100
			},
			'if the func is created with only two arguments and cond returns false': {
				createdFunc: _.overTern(_.partialRight(_.has, 'c'), _.partialRight(_.get, 'c')),
				inputs: [{'a': 1, 'z': 10, 'd': 100}],
				expectedResult: {'a': 1, 'z': 10, 'd': 100}
			}
		}, function (config, desc) {
			describe(desc, function () {
				var firstOrSecond = _.includes(desc, 'true') ? 'first' : 'second';
				it('should return the result of the arguments passed to the ' + firstOrSecond + ' callback', function () {
					assert.deepEqual(config.createdFunc.apply(null, config.inputs), config.expectedResult);
				});
			});
		});
	});
	
	describe('thisBind', function () {
		// TODO: Test
	});
	
	describe('defaultZero', function () {
		_.each({
			'when called with no params': [],
			'when called with undefined': [undefined],
			'when called with null': [null],
			'when called with false': [false],
			'when called with an empty string': [''],
			'when called with 0': [0],
			'when called with multiple params': [1, true, '1', {}],
			'when called with a number': [12],
			'when called with true': [true],
			'when called with a string': 'abc',
			'when called with an object': [{}],
			'when called with an empty array': [[]]
		}, function (param, desc) {
			describe(desc, function () {
				if (param[0]) {
					it('should return ' + param[0], function () {
						assert.deepEqual(_.spread(_.defaultZero)(param), param[0]);
					});
				}
				else {
					it('should return 0', function () {
						assert.deepEqual(_.spread(_.defaultZero)(param), 0);
					});
				}
			});
		});
	});
	
	describe('setEach', function () {
		var emptyObject = {};
		var objectWithNonDeepPropeties = {a: 1, b: 2, c: 3};
		var objectWithDeepProperties = {a: {b: {c: 1}}, d: {e: {f: 2}}, g: {h: {i: 3}}};
		_.each({
			'when called with empty object and one non-deep path-value pair': {
				object: emptyObject,
				paths: ['x'],
				values: [10],
				should: 'set the value at the path'
			},
			'when called with empty object and multiple non-deep path-value pairs': {
				object: emptyObject,
				paths: ['x', 'y', 'z'],
				values: [10, 20, 30],
				should: 'set the values at the paths'
			},
			'when called with empty object and one deep path-value pair': {
				object: emptyObject,
				paths: ['x.y.z'],
				values: [10],
				should: 'set the value at the nested path'
			},
			'when called with empty object and multiple deep path-value pairs': {
				object: emptyObject,
				paths: ['x.y.z', 'y.z.x', 'z.x.y'],
				values: [10, 20, 30],
				should: 'set the values at the nested paths'
			},
			'when called with empty object and multiple deep path-value pairs that intersect': {
				object: emptyObject,
				paths: ['x.y.z', 'x.y.zz', 'x.y.z.a', 'x.yy', 'x.yy.c', 'x.yy.c.q', 'x.yy.d'],
				values: [10, 20, 30, 40, 50, 60, 70],
				should: 'set the values at the nested paths'
			},
			'when called with an object with non-deep properties and on existing non-deep path-value pairs': {
				object: objectWithNonDeepPropeties,
				paths: ['a', 'b'],
				values: [10, 20],
				should: 'set overwrite values at the paths'
			},
			'when called with an object with non-deep properties and on non-existing non-deep path-value pairs': {
				object: objectWithNonDeepPropeties,
				paths: ['d', 'e'],
				values: [10, 20],
				should: 'set the values at the paths'
			},
			'when called with an object with non-deep properties and on deep paths that conflict with existing paths': {
				object: objectWithNonDeepPropeties,
				paths: ['a.d.e', 'b.f.g'],
				values: [10, 20],
				should: 'NOT set the values at the paths'
			},
			'when called with an object with non-deep properties and on deep paths that do not conflict with existing paths': {
				object: objectWithNonDeepPropeties,
				paths: ['m.a.d.e', 'n.b.f.g'],
				values: [10, 20],
				should: 'set the values at the nested paths'
			},
			'when called with an object with deep properties and on deep paths that intersect existing paths': {
				object: objectWithDeepProperties,
				paths: ['a', 'd.e', 'g.h.i'],
				values: [10, 20, 30],
				should: 'overwrite the values at the nested paths'
			},
			'when called with an object with deep properties and on deep paths that only intersect top level': {
				object: objectWithDeepProperties,
				paths: ['a.x', 'd.y', 'g.z'],
				values: [10, 20, 30],
				should: 'overwrite the values at the nested paths'
			},
			'when called with an object with deep properties and on deep paths that add new leaves at bottom level': {
				object: objectWithDeepProperties,
				paths: ['a.b.x', 'd.y', 'g.z'],
				values: [10, 20, 30],
				should: 'set the values at the nested paths'
			}
		}, function (config, desc) {
			describe(desc, function () {
				var clonedObject = _.cloneDeep(config.object);
				var expectedResult = _.cloneDeep(config.object);
				_.each(config.paths, function (path, index) {
					_.set(expectedResult, path, config.values[index])
				});
				var result = _.setEach(clonedObject, config.paths, config.values);
				it('should ' + config.should, function () {
					assert.deepEqual(clonedObject, expectedResult);
				});
				
				it('should return the object', function () {
					assert.deepEqual(result, expectedResult);
				});
			});
		});
	});
	
	describe('mapKeysAndValues', function () {
		var testObject = {a: 1, b: 2, c: 3};
		
		_.each({
			'when used with one callback that returns an array pair ': {
				generator: function (valueMap, keyMap) {
					return [function (value, key) {return [valueMap(value), keyMap(key)];}]
				}
			},
			'when used with one callback that returns a single property object ': {
				generator: function (valueMap, keyMap) {
					return [function (value, key) {return _.set({}, keyMap(key), valueMap(value));}]
				}
			},
			'when used with two callbacks ': {
				generator: function (valueMap, keyMap) {
					return [function (value) {return valueMap(value);}, function (key) {return keyMap(key);}]
				}
			}
		}, function (callbackConfig, callBackDesc) {
			var keyMap = {
				'to map keys only': function (key) {return key + 'x';},
				'to map values only': _.identity,
				'to map keys and values': function (key) {return key + 'x';}
			};
			var valueMap = {
				'to map keys only': _.identity,
				'to map values only': function (value) {return _.toString(value * 2);},
				'to map keys and values': function (value) {return _.toString(value * 2);}
			};
			_.each({
				'to map keys only': {ax: 1, bx: 2, cx: 3},
				'to map values only': {a: '2', b: '4', c: '6'},
				'to map keys and values': {ax: '2', bx: '4', cx: '6'},
			}, function (expectedResult, desc) {
				describe(callBackDesc + desc, function () {
					var callbacks = callbackConfig.generator(valueMap[desc], keyMap[desc]);
					var result = _.spread(_.mapKeysAndValues, 1)(testObject, callbacks);
					it('should ' + desc.slice(3), function () {
						assert.deepEqual(result, expectedResult);
					});
				});
			});
		});
		
		describe('when called without callbacks', function () {
			it('should just return the original object', function () {
				assert.deepEqual(_.mapKeysAndValues({x: {y: 1.1}}), {x: {y: 1.1}});
			});
		});

		describe('when called with a function that switches keys and values', function () {
			it('should map the keys to the values and values to keys', function () {
				var testObject = {'abc': 123, 'def': 456, 'ghi': 789};
				var mapFunc = function (value, key) {return _.set({}, value, key)};
				assert.deepEqual(_.mapKeysAndValues(testObject, mapFunc), {123: 'abc', 456: 'def', 789: 'ghi'});
			});
		});
	});
	
	describe('under', function () {
		_.each({
			'when creating a function with one number param and calling it with one iteratee': {
				params: [7.2],
				iteratees: [_.floor],
				expectedResult: [7]
			},
			'when creating a function with one number param and calling it with multiple iteratees': {
				params: [7.2],
				iteratees: [_.floor, _.ceil, _.isInteger, _.isNumber],
				expectedResult: [7, 8, false, true]
			},
			'when creating a function with multiple number params and calling it with one iteratee': {
				params: [1, 2, 3, 4],
				iteratees: [_.subtract],
				expectedResult: [-1]
			},
			'when creating a function with multiple number params and calling it with multiple iteratees': {
				params: [1, 2, 3, 4],
				iteratees: [_.rest(_.sum), _.rest(_.min), _.nthArg(2), _.concat],
				expectedResult: [10, 1, 3, [1, 2, 3, 4]]
			},
			'when creating a function with one object param and calling it with one iteratee': {
				params: [{'a': 1, 'b': 2, 'c': 3}],
				iteratees: [_.keys],
				expectedResult: [['a', 'b', 'c']]
			},
			'when creating a function with one string param and calling it with multiple iteratees': {
				params: ['hello world'],
				iteratees: [_.words, _.toUpper, _.size, _.map],
				expectedResult: [['hello', 'world'], 'HELLO WORLD', 11, ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']]
			},
			'when creating a function with multiple array params and calling it with one iteratee': {
				params: [[0, 1], ['0', '1'], [false, true, null], ['null', {}]],
				iteratees: [_.rest(_.flow(_.flattenDeep, _.partialRight(_.map, _.flow(_.toNumber, _.toString))))],
				expectedResult: [['0', '1', '0', '1', '0', '1', '0', 'NaN', 'NaN']]
			},
			'when creating a function with multiple truthy/falsy params and calling it with multiple iteratees': {
				params: [true, false, null, undefined, 0, 1, {}, ''],
				iteratees: [_.rest(_.compact), _.rest(_.every, 0), function (a, b, c) {return _.concat(a, b, c).join();}],
				expectedResult: [[true, 1, {}], false, 'true,false,']
			}
		}, function (config, desc) {
			describe(desc, function () {
				var underFunc = _.spread(_.under)(config.params);
				it('should return an array containing a result for each iteratee', function () {
					assert.deepEqual(_.spread(underFunc)(config.iteratees), config.expectedResult);
				});
			});
		});
	});
	
	describe('mapOver', function () {
		_.each({
			'when arguments are all numbers': {
				testParams: [3, 7],
				testFunc: _.add,
				testMap: function (x) {return x * 2;},
				expectedResult: 20
			},
			'when arguments are all strings': {
				testParams: ['a', 'b', 'c', 'd'],
				testFunc: _.concat,
				testMap: _.toUpper,
				expectedResult: ['A', 'B', 'C', 'D']
			},
			'when arguments are modified in multiple ways': {
				testParams: ['a', 'b', 'c', 'd'],
				testFunc: _.flow(
					_.concat,
					_.partialRight(_.map, _.ary(_.repeat, 2)),
					_.partialRight(_.map, _.add)
				),
				testMap: _.toUpper,
				expectedResult: ['0', 'B1', 'CC2', 'DDD3']
			},
			'when arguments are all objects': {
				testParams: [{'a': 1}, {'b': 2}, {'a': 5}, {'d': 4}],
				testFunc: _.merge,
				testMap: _.invert,
				expectedResult: {1: 'a', 2: 'b', 4: 'd', 5: 'a'}
			}
		}, function (config, desc) {
			describe(desc, function() {
				it('should pass the arguments through the map before calling them', function() {
					assert.deepEqual(_.spread(_.mapOver(config.testFunc, config.testMap))(config.testParams), config.expectedResult)
				});
			});
		});
	});
	
	describe('isEnd', function () {
		_.each({
			'when path is empty and object is null': {
				obj: null,
				path: '',
				expectedResult: ''
			},
			'when path is empty and object is a truthy primitive': {
				obj: 12,
				path: '',
				expectedResult: null
			},
			'when path is one property deep and object is null': {
				obj: null,
				path: 'a',
				expectedResult: ''
			},
			'when path is one property deep and resolves to null': {
				obj: {'a': null, 'b': 'qwe'},
				path: 'a',
				expectedResult: 'a'
			},
			'when path is one property deep and resolves to undefined': {
				obj: {'a': undefined, 'b': 'qwe'},
				path: 'a',
				expectedResult: null
			},
			'when path is one property deep and resolves to object with a null property': {
				obj: {'a': {'x': null}, 'b': 'qwe'},
				path: 'a',
				expectedResult: null
			},
			'when path is one property deep and resolves to truthy primitive': {
				obj: {'a': true, 'b': 'qwe'},
				path: 'a',
				expectedResult: null
			},
			'when path is five properties deep and object is null': {
				obj: null,
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: ''
			},
			'when path is five properties deep and first property resolves to null': {
				obj: {a: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a'
			},
			'when path is five properties deep and first property resolves to undefined': {
				obj: {a: undefined, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
			'when path is five properties deep and first property resolves to truthy primitive': {
				obj: {a: 'test', b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
			'when path is five properties deep and third property resolves to null': {
				obj: {a: {aa: {aaa: null}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a.aa.aaa'
			},
			'when path is five properties deep and third property resolves to undefined': {
				obj: {a: {aa: {aaa: undefined}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
			'when path is five properties deep and third property resolves to truthy primitive': {
				obj: {a: {aa: {aaa: [[]]}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
			'when path is five properties deep and fifth property resolves to null': {
				obj: {a: {aa: {aaa: {aaaa: {aaaaa: null}}}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a.aa.aaa.aaaa.aaaaa'
			},
			'when path is five properties deep and fifth property resolves to undefined': {
				obj: {a: {aa: {aaa: {aaaa: {}}}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
			'when path is five properties deep and fifth property resolves to truthy primitive': {
				obj: {a: {aa: {aaa: {aaaa: {aaaaa: 14}}}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: null
			},
		}, function (config, desc) {
			describe(desc + ' and target is null', function () {
				it('should return ' + config.expectedResult, function () {
					assert.strictEqual(_.isEnd(config.obj, config.path, null), config.expectedResult);
				});
			});
		});
		
		_.each({
			'when path is one property deep and resolves to true': {
				obj: {'a': true, 'b': 'qwe'},
				path: 'a',
				expectedResult: 'a',
				target: true
			},
			'when path is five properties deep and first property resolves to an empty object': {
				obj: {a: {}},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a',
				target: {}
			},
			'when path is five properties deep and third property resolves to a specific string': {
				obj: {a: {aa: {aaa: 'testX'}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a.aa.aaa',
				target: 'testX'
			},
			'when path is five properties deep and fifth property resolves to an array with falsy values': {
				obj: {a: {aa: {aaa: {aaaa: {aaaaa: [false, undefined, null]}}}}, b: null},
				path: 'a.aa.aaa.aaaa.aaaaa',
				expectedResult: 'a.aa.aaa.aaaa.aaaaa',
				target: [false, undefined, null]
			}
		}, function (config, desc) {
			describe(desc + ' and target matches the value at path', function () {
				it('should return the path at which the value is found', function () {
					assert.strictEqual(_.isEnd(config.obj, config.path, config.target), config.expectedResult);
				});
			});
		});
	});
	
	describe('spreadOver', function () {
		_.each({
			'when used with one param and one callback': {
				params: [10],
				callbacks: [_.toString],
				expectedResult: ['10']
			},
			'when used with one param and two callbacks': {
				params: [10],
				callbacks: [_.toString, _.castArray],
				expectedResult: ['10', [undefined]]
			},
			'when used with two params and one callback': {
				params: [10, 20],
				callbacks: [_.toString],
				expectedResult: ['10']
			},
			'when used with two params and two callbacks': {
				params: [10, 20],
				callbacks: [_.toString, _.castArray],
				expectedResult: ['10', [20]]
			},
			'when used with three params and one callback': {
				params: [10, 20, false],
				callbacks: [_.toString],
				expectedResult: ['10']
			},
			'when used with three params and three callbacks': {
				params: [10, 20, false],
				callbacks: [_.toString, _.castArray, _.isBoolean],
				expectedResult: ['10', [20], true]
			},
			'when used with three params and five callbacks': {
				params: [10, 20, false],
				callbacks: [_.toString, _.castArray, _.isBoolean, _.isNull, _.negate(_.isUndefined)],
				expectedResult: ['10', [20], true, false, false]
			},
			'when used with callbacks that take multiple possible params': {
				params: [1, 2, 3],
				callbacks: [_.concat, _.add, _.nthArg(1)],
				expectedResult: [[1], 2, undefined]
			},
			'when used with callbacks that take no params': {
				params: [1, 2, 3],
				callbacks: [_.stubTrue, _.noop],
				expectedResult: [true, undefined]
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should spread the params one by one over the given functions and return the results as an array', function () {
					var func = _.spread(_.spreadOver)(config.callbacks);
					assert.deepEqual(_.spread(func)(config.params), config.expectedResult);
				});
				
				it('should work if callbacks are passed as an array', function () {
					var func = _.spreadOver(config.callbacks);
					assert.deepEqual(_.spread(func)(config.params), config.expectedResult);
				});
			});
		});
	})
	
	describe('compactObject', function () {
		_.each({
			'when object has no properties': {
				obj: {},
				expectedResult: {}
			},
			'when object has one truthy property': {
				obj: {a: 1},
				expectedResult: {a: 1}
			},
			'when object has empty array and object properties': {
				obj: {a: [], b: {}},
				expectedResult: {a: [], b: {}}
			},
			'when object has some falsy and some truthy properties': {
				obj: {a: [1], b: 'abc', c: true, d: false, e: null, f: undefined},
				expectedResult: {a: [1], b: 'abc', c: true}
			},
			'when object has multiple falsy properties': {
				obj: {a: 0, b: '', c: NaN, d: false, e: null, f: undefined},
				expectedResult: {}
			},
			'when object has multiple truthy properties': {
				obj: {a: [0], b: 'abc', c: true, d: [], e: '0', f: 0.1},
				expectedResult: {a: [0], b: 'abc', c: true, d: [], e: '0', f: 0.1}
			},
			'when object has some falsy and some truthy properties in a deeply nested child object': {
				obj: {first: {second: {third: {a: [1], b: 'abc', c: true, d: false, e: null, f: undefined}}}},
				expectedResult: {first: {second: {third: {a: [1], b: 'abc', c: true}}}}
			},
			'when object has some falsy and some truthy properties in three deeply nested child objects': {
				obj: {
					A: {B: {C: {1: '0', 2: 0}}},
					D: {E: {F: {1: 'false', 2: false}}},
					G: {H: {I: {1: 'undefined', 2: undefined}}}
				},
				expectedResult: {
					A: {B: {C: {1: '0'}}},
					D: {E: {F: {1: 'false'}}},
					G: {H: {I: {1: 'undefined'}}}
				}
			},
			'when object has multiple paths that resolve to falsy': {
				obj: {
					A: {B: {C: {1: 0}}},
					D: {E: {F: {1: false}}},
					G: {H: {I: {1: undefined}}}
				},
				expectedResult: {
					A: {B: {C: {}}},
					D: {E: {F: {}}},
					G: {H: {I: {}}}
				}
			},
			'when object has multiple paths that resolve to truthy': {
				obj: {
					A: {B: {C: {1: {}}}},
					D: {E: {F: {1: [false]}}},
					G: {H: {I: {1: true}}}
				},
				expectedResult: {
					A: {B: {C: {1: {}}}},
					D: {E: {F: {1: [false]}}},
					G: {H: {I: {1: true}}}
				}
			},
			'when object has multiple paths that resolve to truthy': {
				obj: {
					A: {B: {C: {1: {}}}},
					D: {E: {F: {1: [false]}}},
					G: {H: {I: {1: true}}}
				},
				expectedResult: {
					A: {B: {C: {1: {}}}},
					D: {E: {F: {1: [false]}}},
					G: {H: {I: {1: true}}}
				}
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return the object with all falsy properties removed', function () {
					assert.deepEqual(_.compactObject(config.obj), config.expectedResult);
				});
			})
		});
	});
	
	describe('leafCount', function () {
		var obj1 = {a: 1, b: 2, c: 3};
		var obj2 = {a: {x: 1}, b: {x: 2}, c: {x: 3}};
		var obj3 = {a: {b: {c: {d: {e: {f: {g: {h: 10}}}}}}}};
		var obj4 = {x: obj1, y: obj2, z: obj3};
		
		_.each({
			'when an object has first level properties only': {
				arg: obj1,
				expectedResult: 3,
				should: 'return the number of properties'
			},
			'when an object has first and second level properties': {
				arg: obj2,
				expectedResult: 3,
				should: 'return the sum of first and second level properties'
			},
			'when an object has deeply nested properties': {
				arg: obj3,
				expectedResult: 1,
				should: 'return a count for each propery on the path'
			},
			'when an object has multiple deeply nested properties': {
				arg: obj4,
				expectedResult: 7,
				should: 'return a count for each propery on every path'
			}
		}, function (config, desc) {
			describe(desc, function () {
				it(config.should, function () {
					assert.equal(_.leafCount(config.arg), config.expectedResult)
				});
			});
		});
	});
	
	describe('allEqual', function () {
		_.each({
			'when all args are null': {
				args: [null, null, null],
				expectedResult: true,
			},
			'when all args are undefined': {
				args: [undefined, undefined, this.xyz],
				expectedResult: true,
			},
			'when all args are numbers': {
				args: [3.4, 3.4, 3.4, 3.4],
				expectedResult: true,
			},
			'when all args are booleans': {
				args: [false, false],
				expectedResult: true
			},
			'when all args are empty objects': {
				args: [{}, {}],
				expectedResult: true
			},
			'when all args are objects with one level of properties': {
				args: [{a: 12, b: true}, {a: 12, b: true}],
				expectedResult: true
			},
			'when all args are objects with deeply nested properties': {
				args: [{a: 12, b: {z: true}, c: {d: {e: {f: null, g: 'q'}}}}, {a: 12, b: {z: true}, c: {d: {e: {f: null, g: 'q'}}}}],
				expectedResult: true
			},
			'when all args are empty arrays': {
				args: [[], []],
				expectedResult: true
			},
			'when all args are arrays with multiple elements': {
				args: [[true, null, {a: 1}, '12', {b: undefined}], [true, null, {a: 1}, '12', {b: undefined}]],
				expectedResult: true
			},
			'when all args are functions': {
				args: [_.noop, _.noop],
				expectedResult: true
			},
			'when all args are strings': {
				args: ['abc', 'abc', 'abc'],
				expectedResult: true
			},
			'when there is only one arg': {
				args: [null],
				expectedResult: true
			},
			'when all args except 1 are null': {
				args: [null, null, null, undefined],
				expectedResult: false,
			},
			'when all args except 1 are undefined': {
				args: [null, null, this],
				expectedResult: false,
			},
			'when all args except 1 are numbers': {
				args: [3.4, '3.4', 3.4, 3.4],
				expectedResult: false,
			},
			'when all args except 1 are booleans': {
				args: [null, false, false],
				expectedResult: false
			},
			'when all args except 1 are empty objects': {
				args: [{}, [], {}],
				expectedResult: false
			},
			'when all args are objects with some different properties': {
				args: [{a: 12, b: true}, {a: 12, b: true}, {a: 12, c: true}],
				expectedResult: false
			},
			'when all args are objects with some different deeply nested properties': {
				args: [{a: 12, b: {z: true}, c: {d: {e: {f: null, g: 'q'}}}}, {a: 12, b: {z: true}, c: {g: {e: {f: null, g: 'q'}}}}],
				expectedResult: false
			},
			'when all args except 1 are empty arrays': {
				args: [[1], [], []],
				expectedResult: false
			},
			'when all args are arrays with some different elements': {
				args: [[true, null, {a: 1}, '12', {b: undefined}], [true, [], {a: 1}, '12', {b: undefined}]],
				expectedResult: false
			},
			'when all args except 1 are functions': {
				args: [_.noop, 'not a function', _.noop],
				expectedResult: false
			},
			'when all args except 1 are strings': {
				args: ['abc', 'abc', {abc: {}}],
				expectedResult: false
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return ' + config.expectedResult, function () {
					assert.strictEqual(_.spread(_.allEqual)(config.args), config.expectedResult);
				});
			});
		});
	});
	
	describe('allToAll', function () {
		_.each({
			'when all args are null and testing for equality': {
				args: [null, null, null],
				func: _.isEqual,
				expectedResult: true,
			},
			'when all args are undefined and for equal size': {
				args: [undefined, undefined, this.xyz],
				func: function (a, b) {return _.isEqual(_.size(a), _.size(b))},
				expectedResult: true,
			},
			'when all args are numbers and testing that their sum is < 7': {
				args: [3.4, 3.3, 3.2, 3.1],
				func: _.flow(_.add, _.partialRight(_.lt, 7)),
				expectedResult: true,
			},
			'when all args are falsy and testing that the conjunction of their negations is true': {
				args: [false, false, null, 0],
				func: function (a, b) {return !a && !b;},
				expectedResult: true
			},
			'when all args are empty objects their keys are equal': {
				args: [{}, {}, {}],
				func: function (a, b) {return _.isEqual(_.keys(a), _.keys(b));},
				expectedResult: true
			},
			'when all args are objects with one level of properties that one of their properties are equal': {
				args: [{a: 12, b: false}, {a: 12, b: true}],
				func: function (a, b) {return a.a === b.a;},
				expectedResult: true
			},
			'when all args are objects with deeply nested properties and testing that they have the same number of leaves': {
				args: [{a: 12, b: {z: true}, c: {d: {e: {f: null, g: 'q'}}}}, {a: 1, b: 2, c: 3, d: 4}, {a: {x: 9, y: 9}, b: {x: 9, y: 9}}],
				func: function (a, b) {return _.isEqual(_.leafCount(a), _.leafCount(b));},
				expectedResult: true
			},
			'when all args are arrays with the same first value and testing that the first values are equal': {
				args: [[4, true], [4, null], [4, 'ty'], [4, [2]]],
				func: function (a, b) {return _.isEqual(_.first(a), _.first(b));},
				expectedResult: true
			},
			'when all args are functions return false when passed true and true when passed false testing that their composition return true': {
				args: [_.negate(_.identity), _.isFalsy, _.flow(_.partial(_.add, 1), _.partial(_.eq, 1)), function (a) {return _.toString(a).length === 5;}],
				func: function (a, b) {return _.flow(a, b)(true);},
				expectedResult: true
			},
			'when all args are strings and testing that each contains the first of the other': {
				args: ['abcdef', 'bcdefa', 'cdefab', 'defabc'],
				func: function (a, b) {return _.includes(a, _.first(b));},
				expectedResult: true
			},
			'when all args are null except 1 and testing for equality': {
				args: [null, null, null, undefined],
				func: _.isEqual,
				expectedResult: false,
			},
			'when all args are undefined except 1 and for equal size': {
				args: [undefined, undefined, this.xyz, [1]],
				func: function (a, b) {return _.isEqual(_.size(a), _.size(b))},
				expectedResult: false,
			},
			'when all args are numbers, with one greater than 7, and testing that their sum is < 7': {
				args: [3.4, 3.3, 32, 3.1],
				func: _.flow(_.add, _.partialRight(_.lt, 7)),
				expectedResult: false,
			},
			'when all args are falsy except 1 and testing that the conjunction of their negations is true': {
				args: [false, false, null, 1],
				func: function (a, b) {return !a && !b;},
				expectedResult: false
			},
			'when all args are empty objects except 1 and their keys are equal': {
				args: [{}, {a: 1}, {}],
				func: function (a, b) {return _.isEqual(_.keys(a), _.keys(b));},
				expectedResult: false
			},
			'when all args are objects with one level of properties and testing that one of their properties are equal': {
				args: [{a: 12, b: false}, {a: 13, b: true}],
				func: function (a, b) {return a.a === b.a;},
				expectedResult: false
			},
			'when all args are objects with different numbers of deeply nested properties and testing that they have the same number of leaves': {
				args: [{a: 12, b: {z: true, x: 1}, c: {d: {e: {f: null, g: 'q'}}}}, {a: 1, b: 2, c: 3, d: 4}, {a: {x: 9, y: 9}, b: {x: 9, y: 9}}],
				func: function (a, b) {return _.isEqual(_.leafCount(a), _.leafCount(b));},
				expectedResult: false
			},
			'when all args are arrays with the some different first values and testing that the first values are equal': {
				args: [[4, true], [4, null], ['4', 'ty'], [4, [2]]],
				func: function (a, b) {return _.isEqual(_.first(a), _.first(b));},
				expectedResult: false
			},
			'when all args are functions return false when passed true and true when passed false except 1 and testing that their composition return true': {
				args: [_.negate(_.identity), _.stubFalse, _.isTruthy, _.flow(_.partial(_.add, 1), _.partial(_.eq, 1)), function (a) {return _.toString(a).length === 5;}],
				func: function (a, b) {return _.flow(a, b)(true);},
				expectedResult: false
			},
			'when all args are strings and testing that each contains the first of the other in case some dont': {
				args: ['abcdef', 'bcdefa', 'cdfab', 'efabc'],
				func: function (a, b) {return _.includes(a, _.first(b));},
				expectedResult: false
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return ' + config.expectedResult, function () {
					assert.strictEqual(_.allToAll(config.func, config.args), config.expectedResult);
				});
			});
		});
	});
	
	describe('allToOthers', function () {
		// TODO: improve descriptions
		_.each({
			'when comparison returns true if leaf counts are the same but full size is different': {
				args: [{a: 1}, {a: {b: 1}}, {a: {b: {c: 1}}}],
				func: function (a, b) {return _.leafCount(a) === _.leafCount(b) && _.fullSize(a) !== _.fullSize(b);},
				expectedResult: true,
			},
			'when all args are numbers and testing that their sum is < 7, but that they are not equal': {
				args: [3.4, 3.3, 3.2, 3.1],
				func: function (a, b) {return (a + b < 7) && a !== b;},
				expectedResult: true,
			},
			'when all args are == but not ===': {
				args: [false, 0, ''],
				func: function (a, b) {return a == b && a !== b;},
				expectedResult: true
			},
			'when comparison returns true if leaf counts are not the same but full size is different': {
				args: [{a: 1}, {a: {b: 1}}, {a: {b: {c: 1, d: 1}}}],
				func: function (a, b) {return _.leafCount(a) === _.leafCount(b) && _.fullSize(a) !== _.fullSize(b);},
				expectedResult: false,
			},
			'when all args are numbers and testing that their sum is < 7, but that they are equal': {
				args: [3.4, 3.3, 3.2, 3.4],
				func: function (a, b) {return (a + b < 7) && a !== b;},
				expectedResult: false,
			},
			'when not all args are == or ===': {
				args: [false, 0, '', true],
				func: function (a, b) {return a == b && a !== b;},
				expectedResult: false
			}
		}, function (config, desc) {
			describe(desc, function () {
				it('should return ' + config.expectedResult, function () {
					assert.strictEqual(_.allToOthers(config.func, config.args), config.expectedResult);
				});
			});
		});
	});
	
	describe('cartestianProductOf2', function () {
		var func = function (a, b) {return a + b;}
		var arrays1 = [[1, 2, 3], [4, 5, 6]];
		var arrays2 = [[{}, false, 0], [null, 'ab', func, [1, 2], {a: 1, b: 2}, [undefined]]];
		var arrays3 = [[1, 2, 3, 4, 5], [10]];
		var arrays4 = [[1], [2]];
		var arrays5 = [[], []];
		var arrays6 = [[], [1, 2, 3]];
		
		_.each({
			'when used with arrays of numbers': {
				args: arrays1,
				expectedResult: [
					[1, 4], [1, 5], [1, 6],
					[2, 4], [2, 5], [2, 6],
					[3, 4], [3, 5], [3, 6]
				]
			},
			'when used with arrays of assorted types': {
				args: arrays2,
				expectedResult: [
					[{}, null], [{}, 'ab'], [{}, func], [{}, [1, 2]], [{}, {a: 1, b: 2}], [{}, [undefined]],
					[false, null], [false, 'ab'], [false, func], [false, [1, 2]], [false, {a: 1, b: 2}], [false, [undefined]],
					[0, null], [0, 'ab'], [0, func], [0, [1, 2]], [0, {a: 1, b: 2}], [0, [undefined]]
				]
			},
			'when there are multiple values is one array and only one in the other': {
				args: arrays3,
				expectedResult: [[1, 10], [2, 10], [3, 10], [4, 10], [5, 10]]
			},
			'when there is only one value in each array': {
				args: arrays4,
				expectedResult: [[1, 2]]
			},
			'when both arrays are empty': {
				args: arrays5,
				expectedResult: []
			},
			'when one array is empty': {
				args: arrays6,
				expectedResult: []
			},
		}, function (config, desc) {
			describe(desc, function () {
				it('return the cartesian production of the elements in both arrays', function () {
					assert.deepEqual(_.spread(_.cartestianProductOf2)(config.args), config.expectedResult)
				});
			});
		});
	});
	
	describe('unsetIf', function () {
		_.each({
			'when path resolves to number which does pass inequality test': {
				obj: {a: {b: 2, c: 2}},
				path: 'a.b',
				predicate: function (val) {return val > 1;},
				expectedResult: {a: {c: 2}}
			},
			'when path resolves to number which does NOT pass inequality test': {
				obj: {a: {b: 2, c: 2}},
				path: 'a.b',
				predicate: function (val) {return val > 3;},
				expectedResult: {a: {b: 2, c: 2}}
			},
			'when path resolves to array which does pass includes test': {
				obj: {a: {b: 2, c: {d: [1, 2], e: ['x', 'y', 'z']}}},
				path: 'a.c.e',
				predicate: function (val) {return _.includes(val, 'z');},
				expectedResult: {a: {b: 2, c: {d: [1, 2]}}}
			},
			'when path resovles to array which does NOT pass includes test': {
				obj: {a: {b: 2, c: {d: [1, 2], e: ['x', 'y', 'z']}}},
				path: 'a.c.e',
				predicate: function (val) {return _.includes(val, 'q');},
				expectedResult: {a: {b: 2, c: {d: [1, 2], e: ['x', 'y', 'z']}}}
			},
			'when path resolves to null and testing for null': {
				obj: {a: {b: 2, c: {d: [1, 2], e: null}}},
				path: 'a.c.e',
				predicate: _.isNull,
				expectedResult: {a: {b: 2, c: {d: [1, 2]}}}
			},
			'when path resolves to defined but testing for undefined': {
				obj: {a: {b: 2, c: {d: [1, 2], e: null}}},
				path: 'a.c.e',
				predicate: _.isUndefined,
				expectedResult: {a: {b: 2, c: {d: [1, 2], e: null}}}
			},
			'when path does not exist': {
				obj: {a: {b: 2, c: {d: [1, 2], e: null}}},
				path: 'a.f.e',
				predicate: _.identity,
				expectedResult: {a: {b: 2, c: {d: [1, 2], e: null}}}
			},
		}, function (config, desc) {
			describe(desc, function() {
				var unsetted = _.has(config.obj, config.path) && config.predicate(_.get(config.obj, config.path));
				var result = _.unsetIf(config.obj, config.path, config.predicate);
				it('should return true if the unset occured, false otherwise', function () {
					assert.equal(unsetted, result);
				});
				
				it('should unset the value, but leave the rest of the object untouched, if the predicate returns true', function () {
					assert.deepEqual(config.obj, config.expectedResult);
				});
			});
		});
	});
	
	describe('square', function () {
		_.each({
			'when used with negative number': -5,
			'when used with 0': 0,
			'when used with decimal number': 3.4,
			'when used with large number': 12345
		}, function (num, desc) {
			it('should square the number', function () {
				assert.equal(_.square(num), num * num)
			});
		});
	});
});

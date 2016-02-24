var _ = require('./lodash-plus.js');
var assert = require('assert');



describe('lodash-plus', function () {
	describe('isNullOrUndefined', function () {
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
	
	describe('includesAny', function () {
		describe('when called with two strings', function () {
			var searchInA = ['abc', 'def', 'ghi', 'jkl'];
			var searchInB = ['xxx', 'yyy', 'zzz'];
			
			var searchForA = ['qqqadgjqqq', 'bqeqhqk', 'qqqlifc'];
			var searchForB = ['x', 'y', 'z'];
			
			describe('and the first string contains at least one letter from the second', function () {
				_.each(searchInA, function (searchInString) {
					_.each(searchForA, function (searchForString) {
						it('should return true', function () {
							assert.equal(_.includesAny(searchInString, searchForString), true);
						});
					});
				});
			});
			
			describe('and the first string contains no letters from the second', function () {
				_.each(searchInA, function (searchInString) {
					_.each(searchForB, function (searchForString) {
						it('should return false', function () {
							assert.equal(_.includesAny(searchInString, searchForString), false);
						});
					});
				});
				
				_.each(searchInB, function (searchInString) {
					_.each(searchForA, function (searchForString) {
						it('should return false', function () {
							assert.equal(_.includesAny(searchInString, searchForString), false);
						});
					});
				});
			});
		});
		
		describe('when called with an array of objects and an array of strings', function () {
			var testObjects = [
				{a: true, b: null, c: 1},
				{d: false, e: NaN, f: 'a'},
				{g: true, h: undefined, i: []},
				{j: false, k: 0, l: _.noop}
			];
			var matchingTestStrings = [['x', 'b', 'q'], ['g', 'l', 'c'], ['z', 'zzz', 'h']];
			var unMatchingTestStrings = [['x', 'y', 'z'], ['ab', 'kl'], ['ll']];
			
			describe('and at least one of the test objects has a property key matching one of the strings', function () {
				_.each(matchingTestStrings, function (stringArray) {
					it('should return true', function () {
						assert.equal(_.includesAny(testObjects, stringArray), true);
					});
				});
			});
			
			describe('and none of the test objects have a property key matching one of the strings', function () {
				_.each(unMatchingTestStrings, function (stringArray) {
					it('should return false', function () {
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
					unmatching: [7, 8, 9]
				},
				'string': {
					first: ['a', 'b', 'c'],
					match: ['d', 'b', 'f'],
					unmatching: ['g', 'h', 'i']
				},
				'assorted': {
					first: [true, NaN, undefined],
					match: [false, 1, NaN],
					unmatching: [null, 0, '1']
				}
			}, function (array, arrayType) {
				it('should return true when at least one element of each ' + arrayType + ' array is equal', function () {
					assert.equal(_.includesAny(array.first, array.match), true);
				});
				
				it('should return false when no elements of either ' + arrayType + ' array are equal', function () {
					assert.equal(_.includesAny(array.first, array.unmatching), false);
				});
			});
		});
	});
	
	describe('hasAny', function () {
		var testObject = {a: 1, b: false, c: undefined, d: {}};
		var matchingArray = ['aa', 'bb', 'c', 'dd'];
		var unMatchingArray = ['aa', 'bb', 'cc', 'dd'];
		
		it('should return true when the object has keys matching at least one array string', function () {
			assert.equal(_.hasAny(testObject, matchingArray), true);
		});
		
		it('should return false when the object has no keys matching any array string', function () {
			assert.equal(_.hasAny(testObject, unMatchingArray), false);
		});
	});
	
	describe('hasAll', function () {
		var testObject = {a: true, b: null, c: 1, d: false, e: NaN, f: 'a'};
		var trueCases = [['a', 'b', 'd'], ['d', 'e', 'f'], ['c'], _.keys(testObject)];
		var falseCases = [['a', 'b', 'm'], ['g', 'h', 'i'], ['z'], _.keys(testObject).concat('q')];
		
		describe('when the object has a key that matches each string in the array', function () {
			_.each(trueCases, function (array) {
				it('should return true', function () {
					assert.equal(_.hasAll(testObject, array), true);
				});
			});
		});
		
		describe('when the there is a string in the array that does not match an object key', function () {
			_.each(falseCases, function (array) {
				it('should return false', function () {
					assert.equal(_.hasAll(testObject, array), false);
				});
			});
		});
	});
	
	describe('isIntable', function () {
		var intables = [-18, 0, 19, '-18', '0', '19', [2], ['2']];
		var nonIntables = [-18.1, null, 19.5, '-18.5', [], {}, 'a', NaN, false, [1, 3], ['1', '3'], {1: 1}];
		
		_.each(intables, function (val) {
			it('should return true', function () {
				assert.equal(_.isIntable(val), true);
			});
		});
		
		_.each(nonIntables, function (val) {
			it('should return false', function () {
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
		var obj2 = _.mapValues(obj1, _.partial(_.set, {}, 'x'));
		var obj3 = _.merge({}, obj1, _.set({}, 'd.e.f.g.h.i', 1));
		var obj4 = {x: obj1, y: obj2, z: obj3};
		
		it('should return the number of nested properties in the object', function () {
			assert.equal(_.fullSize(obj1), 3);
			assert.equal(_.fullSize(obj2), 6);
			assert.equal(_.fullSize(obj3), 9);
			assert.equal(_.fullSize(obj4), 21);
		});
	});
	
	describe('extendAll', function () {
		var collection = [{a: 1}, {b: 2}, {c: 3}];
		var source1 = {d: 4};
		var source2 = {e: {f: 5}, g: {h: 5}};
		var source3 = {a: 10, b: 10, c: 10};
		var source4 = {g: {h: true}};
		var source5 = {d: null, g: {z: false}};
		
		var extendAllClone = _.collCloner(_.extendAll);
		var mapClone = _.collCloner(_.map)
		
		it('should return the collection with each object modified to include the sources', function () {
			assert.deepEqual(extendAllClone(collection, source1), mapClone(collection, function (obj) {
				return _.set(obj, 'd', 4);
			}));
			assert.deepEqual(extendAllClone(collection, source2), mapClone(collection, function (obj) {
				_.set(obj, 'e.f', 5);
				_.set(obj, 'g.h', 5);
				return obj;
			}));
			assert.deepEqual(extendAllClone(collection, source3), [source3, source3, source3]);
			assert.deepEqual(extendAllClone(collection, source2, source4), mapClone(collection, function (obj) {
				_.set(obj, 'e.f', 5);
				_.set(obj, 'g.h', true);
				return obj;
			}));
			assert.deepEqual(extendAllClone(collection, source1, source2, source5), mapClone(collection, function (obj) {
				_.set(obj, 'd', null);
				_.set(obj, 'e.f', 5);
				_.set(obj, 'g.z', false);
				return obj;
			}));
		});
	});
	
	describe('collCloner', function () {
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
		var expectedPaths1 = ['a', 'b', 'c', 'a.x', 'a.y', 'a.z', 'b.x', 'b.y', 'b.z', 'c.x', 'c.y', 'c.z', 'c.z.zz', 'c.z.zzz', 'c.z.zzz.abc'];
		var expectedPaths2 = ['a', 'a.b', 'a.b.c', 'a.b.c.d', 'a.b.c.d.e', 'a.b.c.d.e.f', 'a.b.c.d.e.f.g'];
		var expectedPaths3 = ['a', 'b', 'c', 'd', 'e'];
		
		it('should return an array containing all exact paths to all nested properties', function () {
			assert.deepEqual(_.sortBy(_.allPaths(testObj1)), _.sortBy(expectedPaths1));
			assert.deepEqual(_.sortBy(_.allPaths(testObj2)), _.sortBy(expectedPaths2));
			assert.deepEqual(_.sortBy(_.allPaths(testObj3)), _.sortBy(expectedPaths3));
		});
	});
	
	describe('getAll', function () {
		var testObj1 = {a: {x: 1, y: 2, z: 3}, b: {x: 1, y: 2, z: 3}, c: {x: 1, y: 2, z: {zz: 3, zzz: {abc: 10}}}};
		var testObj2 = {a: {b: {c: {d: {e: {f: {g: 1}}}}}}};
		var testObj3 = {a: 1, b: 2, c: 3, d: undefined, e: undefined};
		
		it('should return all objects at the requested path or default if non-existant', function () {
			assert.deepEqual(_.cloneDeep(_.getAll(testObj1, ['c', 'b.x', 'a.c', 'a.z'], null)), [testObj1.c, testObj1.b.x, null, testObj1.a.z]);
			assert.deepEqual(_.cloneDeep(_.getAll(testObj2, ['a', 'a.b.c', 'a.b.c.d.e.f.g', 'a.b.c.d.e.f.g.h'], 2)), [testObj2.a, testObj2.a.b.c, testObj2.a.b.c.d.e.f.g, 2]);
			assert.deepEqual(_.cloneDeep(_.getAll(testObj3, ['a', 'b', 'd', 'f', 'a.z'])), [testObj3.a, testObj3.b, testObj3.d, undefined, undefined]);
		});
	});
	
	describe('getFirst', function () {
		var testObj1 = {a: {x: 1, y: 2, z: 3}, b: {x: 1, y: 2, z: 3}, c: {x: 1, y: 2, z: {zz: 3, zzz: {abc: 10}}}};
		var testObj2 = {a: {b: {c: {d: {e: {f: {g: 1}}}}}}};
		var testObj3 = {a: 1, b: 2, c: 3, d: undefined, e: undefined};
		
		it('should return the value of the first defined property in the array', function () {
			assert.deepEqual(_.getFirst(testObj1, ['d', 'b.q', 'a.z', 'a.x'], null), testObj1.a.z);
			assert.deepEqual(_.getFirst(testObj2, ['a.c.b', 'a.d.e', 'a.b.c.d.e.f', 'a.b.c'], 2), testObj2.a.b.c.d.e.f);
			assert.deepEqual(_.getFirst(testObj3, ['z', 'x'], 5), 5);
		});
	});
	
	describe('setDefinite', function () {
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
		var obj1 = {a: 1, b: 2, c: 3, d: {e: 5, f: 6}, g: {h: {i: {j: 100}, z: {x: true}}}, k: {l: {m: {n: 200}}}, abc: {a: {x: 11, y: null, z: 33}, b: {x: 44, y: undefined, z: 66}, c: {x: 77, y: false, z: 99}}, zzz: undefined};
		var obj2 = {a: 1, b: 22, d: {e: 5, f: 7}, g: {h: {z: {x: true, y: false}}}, k: {}, abc: {a: {x: '11', y: null, z: 333}, b: {x: '44', y: undefined, z: 666}, c: {x: '77', y: false, z: 999}}};
		
		// TODO: more tests needed
		it('should return true for equal paths and false for unequal', function () {
			assert.deepEqual(_.pathsEqual([obj1, 'a'], [obj2, 'a']), true);
			assert.deepEqual(_.pathsEqual([obj1, 'g.h.z.x'], [obj2, 'g.h.z.x']), true);
			assert.deepEqual(_.pathsEqual([obj1, 'zzz'], [obj2, 'zzz']), false);
		});
	});
	
	describe('innerJoin', function () {
		// TODO: check proper handling of 'abc.b'
		var obj1 = {a: 1, b: 2, c: 3, d: {e: 5, f: 6}, g: {h: {i: {j: 100}, z: {x: true}}}, k: {l: {m: {n: 200}}}, abc: {a: {x: 11, y: null, z: 33}, b: {x: 44, y: undefined, z: 66}, c: {x: 77, y: false, z: 99}}, zzz: undefined};
		var obj2 = {a: 1, b: 22, d: {e: 5, f: 7}, g: {h: {z: {x: true, y: false}}}, k: {}, abc: {a: {x: '11', y: null, z: 333}, b: {x: '44', y: undefined, z: 666}, c: {x: '77', y: false, z: 999}}};
		
		var expectedUnion = {a: 1, d: {e: 5}, g: {h: {z: {x: true}}}, abc: {a: {y: null}, b: {y: undefined}, c: {y: false}}};
		
		it('should return an object of all identical path-property pairs between the two objects', function () {
			assert.deepEqual(_.innerJoin(obj1, obj2), expectedUnion);
		});
	});
	
	describe('filtration', function () {
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
		// TODO: test more cases
		it('should use all functions in the array as filters', function () {
			assert.deepEqual(_.filtration(testCollection1, testFilterArrays), expectedResult)
		});
	});
});

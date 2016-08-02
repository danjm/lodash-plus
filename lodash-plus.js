var _ = require('lodash');

// TODO: tests
_.mixin({definedArgs: _.rest(_.partialRight(_.filter, _.isDefined), 0)});
_.mixin({
	numDefinedArgsAre: _.flow(
		_.partialRight,
		_.partial(_.flow, _.definedArgs, _.size)
	)
});

_.mixin({
	pickTruthy: function (obj, props) {
		return _.overTern(
			_.numDefinedArgsAre(_.eq, 1),
			_.pickBy,
			_.flow(_.pick, _.pickBy)
		)(obj, props);
	}
});

_.mixin({
	isFalsy: function (val) {
		return _.negate(_.isTruthy)(val);
	},
	isTruthy: function (val) {
		return _.flow(
			_.arrayWrap,
			_.some
		)(val);
	},
	isDefined: _.negate(_.isUndefined),
	isNullOrUndefined: function (val) {
		return _.overSome(_.isNull, _.isUndefined)(val);
	},
	isIntable: function (val) {
		// TODO: extract flowover, identity spread, sizeIs, to functions
		return _.bind(_.cond([
			[
				_.overSome(_.isString, _.isNumber),
				_.flow(
					_.over(_.identity, _.identity),
					_.spread(_.overArgs(_.eq, _.toInteger, _.toNumber)))
				],
			[
				_.overEvery(
					_.isArray,
					_.flow(_.tail, _.isEmpty),
					_.overSome(_.isEvery('Integer'), _.isEvery('String'))
				),
				_.flow(_.first, this.isIntable)
			],
			[_.stubTrue, _.stubFalse]
		]), this)(val);
	},
	isBare: function (val) {
		return _.bind(_.cond([
			[_.isUndefined, _.stubTrue],
			[_.overEvery(_.overSome(_.isPlainObject, _.isArrayLikeObject), _.isEmpty), _.stubTrue],
			[_.overSome(_.isPlainObject, _.isArrayLikeObject), _.flow(_.values, _.isEvery('Bare'))],
			[_.stubTrue, _.stubFalse]
		]), this)(val);
	}
});

_.mixin({
	argsLength: function (callback) {
		// TODO: rename this to reflect that it takes a callback and argslength
		// is passed to the callback
		return _.flow(
			_.overTern(_.isUndefined, _.constant(_.identity)),
			_.partial(_.flow, _.rest(_.size))
		)(callback);
	},
	fullSize: function(obj) {
		return _.flow(
			_.over(
				_.partialRight(_.pickBy, _.isPlainObject),
				_.constant(_.overArg(_.add, _.thisBind('fullSize'), 1)),
				_.size
			),
			_.spread(_.reduce)
		)(obj);
	},
	allPaths: function (obj, parentPath) {
		return _.flow(
			_.over(
				_.identity,
				_.flip(_.unary(
					_.curry(_.overTern(
						_.isTruthy,
						_.concat,
						_.rearg(_.arrayWrap, 1)
					), 2)
				))
			),
			_.spread(_.over(
				_.unary(_.partialRight(_.pickBy, _.isPlainObject)),
				_.flow(
					_.nthArg(1),
					_.curry(_.overArg, 3)(_.allPaths, _, 1),
					_.partialRight(_.rearg, 1, 2),
					_.partial(_.over, _.identity),
					_.partialRight(_.flow, _.spread(_.concat)),
					_.partial(_.overTern, _.rearg(_.isPlainObject, 1))
				),
				_.overArgs(_.map, _.keys, _.unary)
			)),
			_.spread(_.reduce)
		)(obj, parentPath);
	}
});

_.mixin({
	collCloner: function (callback) {
		return _.partialRight(_.overArg, _.cloneDeep)(callback);
	}
});

_.mixin({
	hasAll: function (obj, array) {
		return _.overArg(_.flip(_.every), _.curry(_.has))(obj, array);
	},
	hasAny: function (obj, array) {
		return _.overArg(_.flip(_.some), _.curry(_.has))(obj, array);
	},
	includesAny: function (searchIn, searchFor) {
		return _.cond([
			[
				_.rest(_.isEvery('String')),
				_.rearg(_.overArgs(_.some, _.identity, _.curry(_.includes)), 1, 0)
			],
			[
				_.overEvery(
					_.unary(_.isEvery('PlainObject')),
					_.rearg(_.unary(_.isEvery('String')), 1)
				),
				_.negate(_.overArg(_.disjoint, _.partialRight(_.flatMap, _.keys)))
			],
			[_.rest(_.isEvery('Array')), _.negate(_.disjoint)],
			[_.isPlainObject, _.negate(_.overArg(_.disjoint, _.values))],
			[_.stubTrue, _.stubFalse]
		])(searchIn, searchFor);
	},
	disjoint: function (arrayA, arrayB) {
		return _.flow(_.intersection, _.isEmpty)(arrayA, arrayB);
	},
	isEvery: function (predicate) {
		// TODO: only pass predicate to flow
		return _.flow(
			_.overTern(
				_.flip(_.isString),
				_.flow(
					_.over(
						_.identity,
						_.flow(
							_.nthArg(1),
							_.upperFirst,
							_.partial(_.add, 'is')
						)
					),
					_.spread(_.bind(_.get, this))
				),
				_.flip(_.identity)
			),
			_.curryRight(_.every, 2)
		)(this, predicate);
	}
});

_.mixin({
	extendAll: function (collection, sources) {
		return _.overTern(
			_.flow(_.flatten, _.union, _.negate(_.isEvery('PlainObject'))),
			function () {throw new Error('Invalid params');},
			_.spread(_.rest(_.overArg(
				_.each,
				_.flow(_.curry(_.each), _.partial(_.flow, _.curry(_.extend, 2)), _.unary),
				1
			), 1))
		)(arguments);
	}
});

_.mixin({
	nthArgs: function (args) {
		// TODO: tests
		return _.flow(
				_.curry(_.ary(_.includes, 2), 2),
				_.partialRight(_.rearg, 1, 0),
				_.curryRight(_.filter),
				_.partialRight(_.rest, 0)
		)(args)
	},
	getAll: function (object, paths, default_) {
		return _.flow(
			_.over(
				_.nthArg(1),
				_.flow(
					_.nthArgs([0, 2]),
					_.spread(_.curry(_.rearg(_.get, 0, 2, 1), 3))
				)
			),
			_.spread(_.map)
		)(object, paths, default_);
	},
	getFirst: function (object, paths, default_) {
		// TODO: should _.overArg pass all args to the transform? or shoul we
		// create another function to do that?
		return _.flow(
			_.over(
				_.nthArg(0),
				_.ary(_.overArg(_.flip(_.find), _.curry(_.has, 2)), 2),
				_.nthArg(2)
			),
			_.spread(_.get)
		)(object, paths, default_)
	},
	setDefinite: function (object, path, value) {
		return _.overTern(
			_.numDefinedArgsAre(_.eq, 3),
			_.set,
			_.noop
		)(object, path, value);
	},
	setEach: function (object, paths, values) {
		return _.flow(
			_.over(
				_.rearg(_.ary(_.zip, 2), 1, 2),
				_.constant(_.spread(_.set, 1)),
				_.identity
			),
			_.spread(_.reduce)
		)(object, paths, values);
	}
});

_.mixin({
	// TODO: Rename as 'until' to match ruby inspiration?
	eachUntil: function (collection, callback, predicate) {
		_.flow(
			_.over(
				_.identity,
				_.flow(
					_.rearg(_.overArgs(
						_.overTern,
						_.flow(
							_.partialRight(_.concat, _.identity),
							_.find
						),
						_.constant(_.stubFalse),
						_.identity
					), 2, 0, 1),
					_.partialRight(_.ary, 2)
				)
			),
			_.spread(_.each)
		)(collection, callback, predicate);
	},
	overTern: function (cond, ifCond, ifNotCond) {
		return _.flow(
			_.over(
				_.ary(_.concat, 2),
				_.flow(
					_.nthArg(2),
					_.partialRight(_.concat, _.identity),
					_.find,
					_.partial(_.concat, _.stubTrue)
				)
			),
			_.cond
		)(cond, ifCond, ifNotCond);
	}
});

_.mixin({
	pathsEqual: function (pair1, pair2) {
		return _.flow(
			_.over(
				_.flow(
					_.over(
						_.over(_.identity, _.identity),
						_.over(_.flip(_.identity), _.flip(_.identity))
					),
					_.partialRight(_.map, _.spread(_.overArgs(_.has, _.head, _.last)))
				),
				_.flow(
					_.over(
						_.over(_.identity, _.identity),
						_.over(_.flip(_.identity), _.flip(_.identity))
					),
					_.partialRight(_.map, _.spread(_.overArgs(_.get, _.head, _.last))),
					_.spread(_.isEqual)
				)
			),
			_.spread(_.concat),
			_.every
		)(pair1, pair2);
	},
	innerJoin: function (object1, object2) {
		// TODO: does not work for NaN or arrays
		return _.flow(
			_.over(
				_.flow(_.unary(_.allPaths), _.sortBy),
				_.flow(
					_.over(
						_.flow(
							_.rest(_.curry(_.map), 0),
							_.curry(_.rearg(_.flow(
								_.flow,
								_.unary,
								_.partialRight(_.rearg, 1)
							), 0, 1, 2, 4, 3), 5)(
								_.arrayWrap,
								_.curryRight(_.concat, 2),
								_.unary,
								_.spread(_.pathsEqual)
							)
						),
						_.flow(
							_.unary(_.curry(_.get, 2)),
							_.unary,
							_.partialRight(_.rearg, 1),
							_.partial(_.over, _.rest(_.identity)),
							_.partialRight(
								_.flow,
								_.flatten,
								_.spread(_.set)
							)
						)
					),
					_.spread(_.overTern),
					_.partialRight(_.ary, 2)
				),
				_.constant({})
			),
			_.spread(_.reduce)
		)(object1, object2);
	}
});

_.mixin({
	arrayWrap: function (val) {
		return _.partial(_.set, _.concat(), '0')(val);
	},
	defaultZero: function (val) {
		return _.overTern(_.isFalsy, _.constant(0))(val)
	}
})

_.mixin({
	overArg: function (func, transform, argIndex) {
		return _.flow(
			_.over(
				_.identity,
				_.rearg(_.overArgs(
					_.set,
					_.overArgs(_.partial(_.fill, [], _.identity), _.size),
					_.defaultZero
				), 0, 2, 1)
			),
			_.spread(_.overArgs)
		)(func, transform, argIndex);
	},
	filtration: function (collection, filterArray) {
		// TODO: make sure 3rd param does not affect anything
		// TODO: handle matches, matchesProperty and property iteratee shorthands
		return _.flip(_.curry(_.reduce, 3)(_, _.filter, _))(collection, filterArray);
	},
	setBySelf: function (obj, atPath, toPath) {
		return _.flow(
			_.over(
				_.nthArg(0),
				_.nthArg(1),
				_.rearg(_.ary(_.get, 2), 0, 2)
			),
			_.spread(_.set)
		)(obj, atPath, toPath);
	},
	applyToNested: function (func, nestedPath, argIndex) {
		return _.overArgs(
			_.overArg,
			null,
			_.curryRight(_.get, 2),
			null
		)(func, nestedPath, argIndex);
	},
	thisBind: function (func) {
		return _.bind(this[func], this);
	},
	// var sizeIs = function (array, predicate) {
	// 	return _.flow(
	// 		_.flip(_.spreadOver(
	// 			_.flow(
	// 				_.curry(_.eq, 2),
	// 				_.curry(_.overTern, 2)(_.negate(_.isFunction))
	// 			),
	// 			_.size
	// 		)),
	// 		_.spread(_.attempt)
	// 	)(array, predicate);
	// };
	mapKeysAndValues: function (object, valueMap, keyMap) {
		return _.overTern(
			_.numDefinedArgsAre(_.gt, 1),
			_.flow(
				_.over(
					_.identity,
					_.rearg(_.cond([
						[
							_.numDefinedArgsAre(_.eq, 2),
							_.unary(_.curryRight(_.flow, 2)(_.overTern(
								_.isPlainObject,
								_.flow(_.toPairs, _.first),
								_.reverse
							)))
						],
						[
							_.numDefinedArgsAre(_.eq, 3),
							_.flow(
								_.ary(_.spreadOver, 2),
								_.partialRight(_.flow, _.reverse)
							)
						]
					]), 1, 2, 0)
				),
				_.spread(_.map),
				_.fromPairs
			)
		)(object, valueMap, keyMap);
	},
	under: function () {
		// TODO: make arguments passable param like extendAll
		return _.flow(
			_.curryRight(_.attempt, 2),
			_.partial(_.flow, _.unary(_.spread)),
			_.curryRight(_.map, 2),
			_.rest
		)(arguments);
	},
	mapOver: function (func, map) {
		// TODO: extract to overAll, i.e. a "mapOver" generator for all collection functions
		return _.flow(
			_.over(
				_.spread,
				_.flow(_.nthArg(1), _.curryRight(_.map), _.rest)
			),
			_.spread(_.flowRight)
		)(func, map);
	},
	isEnd: function (obj, path, target) {
		return _.flow(
			_.spreadOver(_.identity, _.overTern(_.isString, _.partialRight(_.split, '.')), _.identity),
			_.spread(_.cond([
				[_.isNull, _.constant('')],
				[_.ary(_.overSome(_.rest(_.partialRight(_.some, _.isEmpty), 0), _.negate(_.isPlainObject)), 2), _.constant(null)],
				[_.flow(_.ary(_.get, 2), _.partial(_.isEqual, target)), _.rearg(_.unary(_.partialRight(_.join, '.')), 1)],
				[_.stubTrue, _.overArg(_.thisBind('isEnd'), _.initial, 1)]
			]))
		)(obj, path, target);
	},
	spreadOver: function () {
		// TODO: make arguments passable param like extendAll
		return _.flow(
				_.flatten,
				_.curry(_.map),
				_.curry(_.flow, 3)(
					_.curry(_.get, 2),
					_.partial(_.rearg(_.overArg, 0, 2, 1), _.ary(_.attempt, 2), 1)
				),
				_.partialRight(_.rest, 0)
		)(arguments);
	},
	compactObject: function (obj) {
		// Possible TODO: refactor all to make thisBind unnecessary
		return _.flow(
			_.thisBind('pickTruthy'),
			_.partialRight(_.mapValues, _.overTern(
				_.isPlainObject,
				_.flow(_.flip(_.get), _.compactObject)
			))
		)(obj);
	},
	leafCount: function (obj) {
		return _.partialRight(
			_.reduce,
			_.overArg(
				_.add,
				_.overTern(_.isPlainObject, _.leafCount, _.constant(1)),
				1
			),
			0
		)(obj);
	},
	allEqual: function () {
		return _.flow(
			_.over(_.tail, _.flow(_.head, _.curry(_.isEqual, 2))),
			_.spread(_.every)
		)(arguments);
	},
	allToAll: function (comparator, args) {
		return _.flow(
			_.over(
				_.flow(
					_.nthArg(1),
					_.over(_.identity, _.identity),
					_.spread(_.cartestianProductOf2)
				),
				_.flow(_.spread, _.unary)
			),
			_.spread(_.every)
		)(comparator, args);
	},
	allToOthers: function (comparator, args) {
		return _.flow(
			_.over(
				_.flow(
					_.nthArg(1),
					_.over(_.identity, _.identity),
					_.spread(_.cartestianProductOf2),
					_.partialRight(_.filter, function (val, index, collection) {
						return index % (Math.sqrt(collection.length) + 1) !== 0;
					})
				),
				_.flow(_.spread, _.unary)
			),
			_.spread(_.every)
		)(comparator, args);
	},
	cartestianProductOf2: function (array1, array2) {
		return _.flatMap(array1, function (itemFrom1) {
			return _.map(array2, function (itemFrom2) {
				return [itemFrom1, itemFrom2];
			});
		})
	}
});

module.exports = _;
// Alternate implementation for _.fullSize, requires second param `sum`:
// _.each(_.pickBy(obj, _.isPlainObject),  _.bind(function (val) {
// 	sum = _.add((sum || 0), this.fullSize(val));
// }, this));
// return (sum || 0) + _.size(obj);
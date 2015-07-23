var _ = require('lodash');

var LazyObject = function () {
  this.object = {};
};

LazyObject.prototype.set = function (key, producer) {
  var that = this;
  this.object[key] = _.once(function () {
    return producer(that);
  });
};

LazyObject.prototype.get = function (key) {
  return this.object[key] ? this.object[key]() : undefined;
};

LazyObject.prototype.toObject = function () {
  return _.object(_.map(this.object, function (func, key) {
    return [key, func()];
  }));
};

module.exports = LazyObject;

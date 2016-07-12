'use strict';

module.exports = function (app, options, next) {
  next();
};

module.exports.attributes = {
  name: 'anotherPlugin',
  version: '1.0.0'
};

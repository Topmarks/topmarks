'use strict';

module.exports = function (app, options, next) {
  next();
};

module.exports.attributes = {
  name: 'simplePlugin',
  version: '2.0.0'
};

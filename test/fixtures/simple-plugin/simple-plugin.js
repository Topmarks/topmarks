'use strict';

module.exports = function (app, options) {
  app.addResults({report:"foo"});
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'simplePlugin',
  version: '2.0.0'
};

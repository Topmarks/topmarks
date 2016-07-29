'use strict';

module.exports = function (app, options) {
  app.addResults("This is a report");
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'anotherPlugin',
  version: '1.0.0'
};

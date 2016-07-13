'use strict';

module.exports = function (app, options) {
  app.root.addResults(options.url,module.exports.attributes.name,{report:"foo"});
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'simplePlugin',
  version: '2.0.0'
};

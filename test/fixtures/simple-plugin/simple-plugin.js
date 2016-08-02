/* eslint-disable func-names */
module.exports = function (app) {
  app.addResults({ report: 'foo' });
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'simplePlugin',
  version: '2.0.0',
};

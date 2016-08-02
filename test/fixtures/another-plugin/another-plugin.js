/* eslint-disable func-names */
module.exports = function (app) {
  app.addResults('This is a report');
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'anotherPlugin',
  version: '1.0.0',
};

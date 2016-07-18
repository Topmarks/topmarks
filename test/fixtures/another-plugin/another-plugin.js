'use strict';

module.exports = function (app, options) {
  app.root.addResults("http://example.com",module.exports.attributes.name,"This is a report",'anotherPluginId');
  // console.log('pooper');
  // app.root.startupChrome(9222,'http://garthdb.com').then((result) => {
  //   console.log(result);
  // });
  return Promise.resolve();
};

module.exports.attributes = {
  name: 'anotherPlugin',
  version: '1.0.0'
};

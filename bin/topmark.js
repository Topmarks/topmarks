#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var program = require('commander');
var lib  = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var tempTopmark = require('../lib/topmark');
var Topmark = _interopRequireDefault(tempTopmark);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

program
  .version(require('../package.json').version)
  .option('-c, --chrome-path [path]', 'The path to google-chrome.')
  .option('-p, --port [port]', 'The debugging port for google-chrome')
  .option('-u, --url [url]', 'The url to test')
  .option('-o --output [json, filename]', 'stdout json, or specicify filename')
  .parse(process.argv);

console.log('Starting Topmark');
var topm = new Topmark.default(program.port, program.url);
topm.loading().then(function(loadTime) {
  console.log("Page ["+ topm.url +"] loaded in "+loadTime+"ms");
  // topm.scrolling().then(function(frames) {
  //   console.log(`Total Frame Count ${frames.getTotalFrameCount()}`);
  //   console.log(`Average Frame Rate ${frames.getAverageFrameRate()} fps`);
  //   console.log(`Total Large Frame Count ${frames.getTotalLargeFrameCount()}`);
  //   console.log('Frame time breakdown');
  //   console.log(frames.getBreakDownPercentage());
  //   topm.closeTab().then(function() {
  //     topm.closeConnection().then(function(){
  //       console.log('Topmark Complete');
  //     });
  //   });
  // });
}).catch(function(error) {
  console.error(error);
});

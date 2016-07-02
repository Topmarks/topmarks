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
  .parse(process.argv);

console.log('Starting Topmark');
var topl = new Topmark.default(program.port, program.url);
topl.runAll(function(){
  console.log("Page ("+ topl.url +") LoadTime: "+topl.loadtime);
});

#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var program = require('commander');
var lib  = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Topmark = require('../lib/topmark');

program
  .version(require('../package.json').version)
  .option('-c, --chrome-path [path]', 'The path to google-chrome.')
  .option('-p, --port [port]', 'The debugging port for google-chrome')
  .option('-u, --url [url]', 'The url to test')
  .option('-o --output [json, filename]', 'stdout json, or specicify filename')
  .parse(process.argv);

// console.log('Starting Topmark');
var options = {
  default: {
    port: 9222,
    url: "http://topcoat.io"
  }
};
var topm = new Topmark(options);
// console.log(topm);
topm.register('topmark-loadspeed').then((result) => {
  // console.log(result);
});

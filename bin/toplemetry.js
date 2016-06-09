#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var program = require('commander');
var lib  = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Toplemetry = require(lib + '/toplemetry');

program
  .version(require('../package.json').version)
  .parse(process.argv);

console.log('Starting Toplemetry');

#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var program = require('commander');
var lib  = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Toplemetry = require(lib + '/toplemetry');

program
  .version(require('../package.json').version)
  .option('-c, --chromium-src', 'The Path to telemetry src file')
  .option('-b, --assemble-build', 'Builds the tests, if the testing directory is not present topl will assume it needs to be built')
  .parse(process.argv);

console.log('Starting Toplemetry');
var chromiumSrc = program.chromiumSrc;
var assembleBuild = (program.assembleBuild)? true : false;
console.log(assembleBuild);

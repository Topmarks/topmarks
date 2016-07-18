#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var program = require('commander');
var lib  = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Topmark = require('../lib/topmark');

function list(val) {
  var valArray = val.replace(/\[|\]|"|'/g,'').split(',');
  for (var i = 0; i < valArray.length; i++) {
    valArray[i] = valArray[i].trim();
  }
  return valArray;
}

var cmdValue;
var envValue;

program
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('-p, --port [port]', 'The debugging port for google-chrome (default: 9222).', 9222)
  .option('-u, --url [url]', 'The url to test (default: http://topcoat.io).', "http://topcoat.io")
  .option('-o, --output [filename]', 'Writes results to json file.')
  .option('-a, --append-output', 'Appends results data to existing json file (defined in --output)')
  .option('-q, --plugins [plugin(s)]', 'A list of Topmark test plugins to run (runs default plugins if not specified).', list, ['topmark-loadspeed','topmark-scrollspeed'])
  .option('-i, --id [pageId]', 'A string to represent the webpage being tested, defaults to url')
  .parse(process.argv);

var options = {
  default: {
    port: program.port,
    url: program.url
  }
};

if(program.id) options.default.id = program.id;

var topm = new Topmark(options);
topm.register(program.plugins).then(function(results) {
  var output = [];
  if(program.appendOutput) {
    try {
      fs.accessSync(path.resolve(program.output), fs.F_OK);
      var readData = JSON.parse(fs.readFileSync(path.resolve(program.output),'utf8'));
      if(Array.isArray(readData)) output = output.concat(readData);
    } catch(e) {}
  }
  output = output.concat(topm.results);
  if(program.output) {
    fs.writeFileSync(path.resolve(program.output),JSON.stringify(output));
    console.log("results written to " + program.output)
  } else {
    console.log(JSON.stringify(output));
  }
}).catch(function(err){
  console.error(err);
});

module.exports = program;

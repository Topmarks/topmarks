#!/usr/bin/env node
/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import program from 'commander';
import Topmark from '../lib/topmark';
import existsSync from '../lib/exists-sync';
import pkginfo from 'pkginfo';

pkginfo(module, 'version', 'description');

/**
 *  Private: formats plugin list options
 *
 *  * `val` {string} could be a string representing a single plugin or an array of plugins
 *
 *  ## Example
 *
 *  String could be a simple plugin
 *
 *    somePlugin
 *
 *  Or a collection of plugin strings
 *
 *    [somePlugin,anotherPlugin]
 *
 *  Returns an {Array} of pluginSlugs
 */
function list(val) {
  const valArray = val.replace(/\[|\]|'|'/g, '').split(',');
  valArray.map(Function.prototype.call, String.prototype.trim);
  for (let i = 0; i < valArray.length; i++) {
    valArray[i] = valArray[i].trim();
  }
  return valArray;
}

program
  .version(module.exports.version)
  .description(module.exports.description)
  .option('-p, --port [port]', 'The debugging port for google-chrome (default: 9222).', 9222)
  .option('-u, --url [url]', 'The url to test (default: http://topcoat.io).', 'http://topcoat.io')
  .option('-o, --output [filename]', 'Writes results to json file.')
  .option('-a, --append-output', 'Appends results data to existing json file (defined in --output)')
  .option('-q, --plugins [plugin(s)]',
          'A list of Topmark test plugins to run (runs default plugins if not specified).',
          list,
          ['topmark-loadspeed', 'topmark-scrollspeed'])
  .option('-t, --parameters [string of options]',
    'A JSON string of options to be passed to plugins')
  .parse(process.argv);

const options = {
  default: {
    port: program.port,
    url: program.url,
  },
};

if (program.parameters) Object.assign(options, JSON.parse(program.parameters));

const topm = new Topmark(options);
topm.register(program.plugins).then(() => {
  let output = [];
  let readData;
  if (program.appendOutput) {
    if (existsSync(path.resolve(program.output))) {
      readData = JSON.parse(fs.readFileSync(path.resolve(program.output), 'utf8'));
      if (Array.isArray(readData)) output = output.concat(readData);
    }
  }
  output = output.concat(topm.results);
  if (program.output) {
    fs.writeFileSync(path.resolve(program.output), JSON.stringify(output), { flag: 'w' });
    console.log(`results written to ${program.output}`);
  } else {
    console.log(JSON.stringify(output));
  }
}).catch(console.error);

module.exports = program;

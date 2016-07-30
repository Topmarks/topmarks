#!/usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _topmark = require('../lib/topmark');

var _topmark2 = _interopRequireDefault(_topmark);

var _pkginfo = require('pkginfo');

var _pkginfo2 = _interopRequireDefault(_pkginfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list(val) {
  var valArray = val.replace(/\[|\]|'|'/g, '').split(',');
  valArray.map(Function.prototype.call, String.prototype.trim);
  for (var i = 0; i < valArray.length; i++) {
    valArray[i] = valArray[i].trim();
  }
  return valArray;
}
/* eslint-disable no-console */


_commander2.default.version(_pkginfo2.default.version).description(_pkginfo2.default.description).option('-p, --port [port]', 'The debugging port for google-chrome (default: 9222).', 9222).option('-u, --url [url]', 'The url to test (default: http://topcoat.io).', 'http://topcoat.io').option('-o, --output [filename]', 'Writes results to json file.').option('-a, --append-output', 'Appends results data to existing json file (defined in --output)').option('-q, --plugins [plugin(s)]', 'A list of Topmark test plugins to run (runs default plugins if not specified).', list, ['topmark-loadspeed', 'topmark-scrollspeed']).option('-t, --parameters [string of options]', 'A JSON string of options to be passed to plugins').parse(process.argv);

var options = {
  default: {
    port: _commander2.default.port,
    url: _commander2.default.url
  }
};

if (_commander2.default.parameters) Object.assign(options, JSON.parse(_commander2.default.parameters));

var topm = new _topmark2.default(options);
topm.register(_commander2.default.plugins).then(function () {
  var output = [];
  var readData = void 0;
  if (_commander2.default.appendOutput) {
    try {
      _fs2.default.accessSync(_path2.default.resolve(_commander2.default.output), _fs2.default.F_OK);
      readData = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(_commander2.default.output), 'utf8'));
      if (Array.isArray(readData)) output = output.concat(readData);
    } catch (e) {
      // do nothing
    }
  }
  output = output.concat(topm.results);
  if (_commander2.default.output) {
    _fs2.default.writeFileSync(_path2.default.resolve(_commander2.default.output), JSON.stringify(output), { flag: 'w' });
    console.log('results written to ' + _commander2.default.output);
  } else {
    console.log(JSON.stringify(output));
  }
}).catch(console.error);

module.exports = _commander2.default;
# Topmarks

[![Build Status](https://travis-ci.org/Topmarks/topmarks.svg?branch=master)](https://travis-ci.org/Topmarks/topmarks) [![codecov](https://codecov.io/gh/Topmarks/topmarks/branch/master/graph/badge.svg)](https://codecov.io/gh/Topmarks/topmarks) [![Dependency Status](https://david-dm.org/Topmarks/topmarks.svg)](https://david-dm.org/Topmarks/topmarks)
[![NPM](https://badge.fury.io/js/topmarks.svg)](https://npmjs.org/package/topmarks)

CSS Benchmarking command line tool using Chrome's remote debugging protocol.

---

## Installation

If you want to install Topmarks as a command line tool, just install it globally from [npm](https://docs.npmjs.com/getting-started/installing-node):

```sh
npm install -g topmarks
```

To use Topmarks in a project use:

```sh
npm install --save topmarks
```

## Preparing the Browser for Use With Topmarks

Topcoat utilizes the remote debugger protocol to send commands to the browser and receive reports. Currently the default plugins are optimized for Chrome.

To start Chrome with remote debugging enabled, it needs to be started from the command line with the `--remote-debugging-port=9222` flag included (port 9222 is the default).

A helpful script is added to the `package.json` for starting it on a Mac with Chrome installed in the standard location. From the project directory it can be called using `npm run chrome` and it will execute:

```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=$TMPDIR/chrome-profiling --no-default-browser-check --window-size="800,600"
```

## `Options`

Both the command line tool and node interfaces can use an options object.

Options should be formatted as an object with keys corresponding to the plugin slug (camel cased plugin name), and/or a default key.

The option object is flattened by the `Topmarks.getOptions` method and passed through to the plugin with the plugin specific options overriding any defaults.

```js
import Topmarks from 'topmarks';

const options = {
  default: {
    url: "http://topcoat.io",
    port: 9223
  },
  somePlugin: {
    url: "http://google.com"
  }
};

const topmarks = new Topmarks(options);
console.log(topmarks.getOptions('somePlugin'));
```

Output:

```js
{
  url: "http://google.com",
  port: 9223
}
```

If no options object is provided Topmarks will use these defaults:

```js
{
  default: {
    port: 9222,
    url: 'http://topcoat.io'
  }
}
```

## Usage

### CLI

Topmarks can also be run from the command line (if installed globally) or as an [npm script](https://docs.npmjs.com/misc/scripts).

When installed globally, Topmarks is available from the command line as the `topm` command.

```sh
topm --help
```

Will return the list of commands and options:

* `-h, --help` - output usage information.
* `-V, --version` - output the version number.
* `-p, --port [port]` - The debugging port for google-chrome (default: 9222).
* `-u, --url [url]` - Writes results to json file (default: `http://topcoat.io`).
* `-o, --output [filename]` - Writes results to json file as an array of result objects.
* `-a, --append-output` - Appends results data to the end of an existing json file (defined in `--output`).
* `-q, --plugins [plugin(s)]` - A list of Topmark test plugins to run (runs [default plugins](#default-plugins) if not specified). Currently you have to pass an absolute path to the plugin, something I'd like to fix in the future.

  ```sh
  topm --plugins "[/path/to/some-plugin,/path/to/another-plugin]"
  ```

* `-t, --parameters [string of options]` - A JSON string of options to be passed to plugins.

  ```sh
  topm --parameters "{default:{url:'http://example.com'}}"
  ```

### Node

Topmarks can also be run by [Node.js](https://nodejs.org/en/).

```js
import Topmarks from 'topmarks';

const topmarks = new Topmarks({ default: { url: "http://google.com" } });
topmarks.register('topmark-loadspeed').then(() => {
  //Do something after loading plugins
  //Get access to the results provided by `topmarks.results`
}).catch(console.log);
```

## Plugins

### Default Plugins

The current default plugins included with topmarks:

* [`topmark-loadspeed`](https://github.com/Topmarks/topmark-loadspeed) - reports the time taken to load a website.
* [`topmark-scrollspeed`](https://github.com/Topmarks/topmark-scrollspeed) - simulates scrolling and measures the performance of the animation frames.

### Custom Plugins

If you'd like to write your own plugins to run tests on Topmarks take a look at how the default plugins are written.

Make sure to include the `topmarks-plugin` [keyword in your `package.json`](https://www.npmjs.com/package/keywords) when publishing to npm if you want it to be included in the [correct search](https://www.npmjs.com/search?q=topmarks-plugin)

import remi from 'remi';
import remiRunner from 'remi-runner';
import remiAddResults from 'remi-topmarks-results';

/**
 * Topmark Class
 */
export default class Topmark {
  /**
   *  Public: intiates Topmark object and loads options
   *
   *  * `options` (optional) an {Object} of options for `pluginSlug` or `default`
   *
   *  ## Example
   *
   *    const options = {
   *      default: {
   *        url: "http://topcoat.io",
   *        port: 9222
   *      },
   *      somePlugin: {
   *        url: "http://google.com"
   *      }
   *    };
   *    // url will be overwritten for somePlugin
   */
  constructor(options = {}) {
    this.registrator = remi(this);
    this.registrator.hook(remiRunner());
    this.registrator.hook(remiAddResults());
    this.options = options;
  }
  /**
   *  Private: flattens options appropriately
   *
   *  * `pluginSlug` {string} plugin identifier for getting plugin options, or defaults
   *
   *  ## Example
   *
   *    const options = {
   *      default: {
   *        url: "http://topcoat.io",
   *        port: 9222
   *      },
   *      somePlugin: {
   *        url: "http://google.com"
   *      }
   *    };
   *    console.log(this.getOptions('somePlugin'))
   *
   *  Outputs a plugin ready object of options:
   *
   *    {
   *      url: "http://google.com",
   *      port: 9222
   *    }
   *
   *  Returns an {Object}
   */
  getOptions(pluginSlug) {
    let result = { port: 9222, url: 'http://topcoat.io' };
    if (this.options.hasOwnProperty(pluginSlug) && this.options.hasOwnProperty('default')) {
      result = Object.assign(result, this.options.default, this.options[pluginSlug]);
    } else if (this.options.hasOwnProperty(pluginSlug) && !this.options.hasOwnProperty('default')) {
      result = Object.assign(result, this.options[pluginSlug]);
    } else if (this.options.hasOwnProperty('default')) {
      result = Object.assign(result, this.options.default);
    }
    return result;
  }
  /**
   *  Private: loads Topmkarks plugins
   *
   *  * `thing` {string|Array} plugin - a string to require plugin or array of plugin strings.
   *
   *  ## Example
   *
   *    this.loadPlugins(params)
   *      .then((plugins) => {
   *        this.registrator.register(plugins)
   *      });
   *
   *  Returns a {Promise}
   */
  loadPlugins(thing) {
    return new Promise((resolve, reject) => {
      if (typeof thing === 'string') {
        // eslint-disable-next-line global-require
        const plugin = require(thing);
        resolve([{ register: plugin, options: this.getOptions(plugin.attributes.name) }]);
      } else if (typeof thing === 'object' && Array.isArray(thing)) {
        const plugins = thing.map((pluginSlug) => {
          // eslint-disable-next-line global-require
          const plugin = require(pluginSlug);
          return ({ register: plugin, options: this.getOptions(plugin.attributes.name) });
        });
        resolve(plugins);
      } else {
        reject('Must be a plugin string, or an array of plugin strings');
      }
    });
  }
  /**
   *  Public: registers plugin or array of plugins
   *
   *  * `params` {string|Array} a string to require plugin or array of plugin strings.
   *
   *  ## Example
   *
   *    const topmark = new Topmark();
   *    topmark.register([
   *      'simple-plugin',
   *      'another-plugin',
   *    ]).then(() => {
   *      //Do something after loading plugins
   *    }).catch(console.log);
   *
   *  Returns a {Promise}
   */
  register(params) {
    return this.loadPlugins(params).then(this.registrator.register);
  }
}

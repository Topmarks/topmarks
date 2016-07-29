import remi from 'remi';
import remiRunner from 'remi-runner';
import remiAddResults from 'remi-topmarks-results';

export default class Topmark {
  constructor(options = {}) {
    this.registrator = remi(this);
    this.registrator.hook(remiRunner());
    this.registrator.hook(remiAddResults());
    this.options = options;
  }
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
  loadPlugins(thing) {
    return new Promise((resolve, reject) => {
      if (typeof thing === 'string') {
        const plugin = require(thing);
        resolve([{ register: plugin, options: this.getOptions(plugin.attributes.name) }]);
      } else if (typeof thing === 'object' && Array.isArray(thing)) {
        const plugins = thing.map((pluginSlug) => {
          const plugin = require(pluginSlug);
          return ({ register: plugin, options: this.getOptions(plugin.attributes.name) });
        });
        resolve(plugins);
      } else {
        reject('Must be a plugin string, or an array of plugin strings');
      }
    });
  }
  register(params) {
    return this.loadPlugins(params).then((plugins) => this.registrator.register(plugins));
  }
}

import Chrome from 'chrome-remote-interface';
import remi from 'remi';
import remiRunner from 'remi-runner';

export default class Topmark {
  constructor(options = {}) {
    this._registrator = remi(this);
    this._registrator.hook(remiRunner());
    this.Chrome = Chrome;
    this.options = options;
    this.results = [];
    if(options.hasOwnProperty('default') && options.default.hasOwnProperty('id')){
      this.pageId = options.default.id;
    }
  }
  addResults(url, pluginSlug, report, pageId = false, timestamp = false) {
    let results = {};
    if(!pageId && this.hasOwnProperty('pageId')) pageId = this.pageId;
    if(pageId) results.id = pageId;
    results.plugin = pluginSlug;
    results.url = url;
    results.timestamp = (timestamp)? timestamp: Date.now();
    results.report = report;
    this.results.push(results);
  }
  getOptions(pluginSlug) {
    let result = {port: 9222, url: "http://topcoat.io"};
    if(this.options.hasOwnProperty(pluginSlug) && this.options.hasOwnProperty('default')){
      result = Object.assign(result, this.options.default, this.options[pluginSlug]);
    } else if(this.options.hasOwnProperty(pluginSlug) && !this.options.hasOwnProperty('default')) {
      result = Object.assign(result, this.options[pluginSlug]);
    } else if (this.options.hasOwnProperty('default')){
      result = Object.assign(result, this.options.default);
    }
    return result;
  }
  loadPlugins(thing) {
    return new Promise((resolve, reject) => {
      if (typeof thing == 'string'){
        let plugin = require(thing);
        resolve([{register: plugin, options: this.getOptions(plugin.attributes.name)}]);
      } else if (typeof thing == 'object' && Array.isArray(thing)) {
        let plugins = thing.map((pluginSlug) => {
          let plugin = require(pluginSlug);
          return({register: plugin, options: this.getOptions(plugin.attributes.name)});
        });
        resolve(plugins);
      } else {
        reject('Must be a plugin string, or an array of plugin strings');
      }
    });
  }
  register(params) {
    return this.loadPlugins(params).then((plugins) => this._registrator.register(plugins));
  }
}

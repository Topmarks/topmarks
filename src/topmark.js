import Chrome from 'chrome-remote-interface';
import remi from 'remi';
import SystemJS from 'systemjs';

System.config({
  defaultJSExtensions: true,
  map:{
    "topmark-loadspeed": "lib/plugins/loadspeed"
  }
})

export default class Topmark {
  constructor(options = {}) {
    this._registrator = remi(this);
    this.Chrome = Chrome;
    this.options = options;
  }
  getOptions(pluginSlug) {
    let result = {};
    if(this.options.hasOwnProperty(pluginSlug) && this.options.hasOwnProperty('default')){
      result = Object.assign({}, this.options.default, this.options[pluginSlug]);
    } else if(this.options.hasOwnProperty(pluginSlug) && !this.options.hasOwnProperty('default')) {
      result = this.options[pluginSlug];
    } else if (this.options.hasOwnProperty('default')){
      result = this.options.default;
    }
    return result;
  }
  loadPlugins(thing) {
    return new Promise((resolve, reject) => {
      if (typeof thing == 'string'){
        SystemJS.import(thing).then((plugin) => {
          resolve([{register: plugin, options: this.getOptions(thing)}]);
        }).catch(err => reject(err));
      } else if (typeof thing == 'object' && Array.isArray(thing)) {
        Promise.all(thing.map((pluginSlug) => {
          return SystemJS.import(pluginSlug);
        })).then((plugins) => {
          resolve(plugins.map((plugin) => {
            return {register: plugin, options: this.getOptions(plugin.attributes.name)}
          }));
        }).catch(err => reject(err));
      } else {
        reject('Must be a plugin string, or an array of plugin strings');
      }
    });
  }
  register(params) {
    return new Promise((resolve, reject) => {
      this.loadPlugins(params).then((plugins)=>{
        this._registrator.register(plugins).then(() => {
          resolve('Plugins registered');
        }).catch(err => reject(err));
      });
    });
  }
}

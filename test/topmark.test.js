import chai from 'chai';
import Topmark from "../src/topmark";

chai.should();

describe('Topmark', () => {
  describe('constructor', () => {
    let goodOptions = {
      'default': {
        'option': true
      },
      'pluginSlug': {
        'option': false
      }
    };
    let topmark = new Topmark(goodOptions);
    it('should accept an options object', () => {
      topmark.options.default.option.should.be.true;
    });
    it('should merge plugin options with default options', () => {
      topmark.getOptions('pluginSlug').option.should.be.false;
    });
    it('should return default options if no pluginSlug options are defined', () => {
      topmark.getOptions('unsetPluginSlug').option.should.be.true;
    });
  });
  describe('registerPlugins', () => {
    it('should register a single plugin from a string', (done) => {
      let topmark = new Topmark();
      topmark.register('another-plugin').then(() => {
        topmark.registrations.anotherPlugin.name.should.equal('anotherPlugin');
        done();
      }).catch(() => done());
    });
    it('Load a plugin from npm', function(done) {
      this.timeout(50000);
      let topmark = new Topmark();
      let packageName = 'topmark-loadspeed';
      let pluginSlug = require(packageName).attributes.name;
      topmark.register(packageName).then((result) => {
        topmark.registrations[pluginSlug].should.not.be.undefined;
        done();
      }).catch(() => done());
    });
    describe('multiple plugins', () => {
      let options = {
        'default': {
          'thing': 1,
          'default': true
        },
        'anotherPlugin': {
          'thing': 2,
          'default': false
        },
        'simplePlugin': {
          'thing': 3
        }
      }
      it('should register multiple plugins from an array of strings', function (done) {
        let topmark = new Topmark(options);
        topmark.register([
          'simple-plugin',
          'another-plugin'
        ]).then((result) => {
          topmark.registrations.anotherPlugin.options.thing.should.equal(options.anotherPlugin.thing);
          topmark.registrations.simplePlugin.options.thing.should.equal(options.simplePlugin.thing);
          topmark.registrations.simplePlugin.name.should.equal('simplePlugin');
          topmark.registrations.anotherPlugin.name.should.equal('anotherPlugin');
          done();
        }).catch(() => done());
      });
    });
  });
  describe('reporting', () => {
    it('should help plugins add reporting data', (done) => {
      let options = {
        "simplePlugin": {
          "url": "http://google.com"
        }
      }
      let topmark = new Topmark(options);
      topmark.register('simple-plugin').then((result) => {
        topmark.results[0].plugin.should.equal('simplePlugin');
        topmark.results[0].url.should.equal("http://google.com");
        done();
      }).catch(() => done());
    });
  });
});

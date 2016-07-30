/* eslint-disable func-names */
import chai from 'chai';
import Topmark from '../src/lib/topmark';

chai.should();

describe('Topmark', () => {
  describe('constructor', () => {
    const goodOptions = {
      default: {
        option: true,
      },
      pluginSlug: {
        option: false,
      },
    };
    const topmark = new Topmark(goodOptions);
    it('should accept an options object', () => {
      topmark.options.default.option.should.equal(true);
    });
    it('should merge plugin options with default options', () => {
      topmark.getOptions('pluginSlug').option.should.equal(false);
    });
    it('should return default options if no pluginSlug options are defined', () => {
      topmark.getOptions('unsetPluginSlug').option.should.equal(true);
    });
  });
  describe('registerPlugins', () => {
    it('should register a single plugin from a string', (done) => {
      const topmark = new Topmark();
      topmark.register('another-plugin').then(() => {
        topmark.registrations.anotherPlugin.name.should.equal('anotherPlugin');
        done();
      }).catch(() => done());
    });
    it('Load a plugin from npm', function (done) {
      this.timeout(50000);
      const topmark = new Topmark();
      const packageName = 'topmark-loadspeed';
      const pluginSlug = require(packageName).attributes.name;
      topmark.register(packageName).then(() => {
        topmark.registrations[pluginSlug].should.not.equal(undefined);
        done();
      }).catch(() => done());
    });
    describe('multiple plugins', () => {
      const options = {
        default: {
          thing: 1,
          default: true,
        },
        anotherPlugin: {
          thing: 2,
          default: false,
        },
        simplePlugin: {
          thing: 3,
        },
      };
      it('should register multiple plugins from an array of strings', (done) => {
        const topmark = new Topmark(options);
        topmark.register([
          'simple-plugin',
          'another-plugin',
        ]).then(() => {
          topmark.registrations.anotherPlugin.options.thing
            .should.equal(options.anotherPlugin.thing);
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
      const options = {
        simplePlugin: {
          url: 'http://google.com',
        },
      };
      const topmark = new Topmark(options);
      topmark.register('simple-plugin').then(() => {
        topmark.results[0].plugin.should.equal('simplePlugin');
        topmark.results[0].url.should.equal('http://google.com');
        done();
      }).catch(() => done());
    });
  });
});

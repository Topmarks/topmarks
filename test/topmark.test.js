import chai from 'chai';
import Topmark from "../src/topmark";

chai.should();

describe('Topmark', () => {
  describe('options in constructor', () => {
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
      }).catch((err) => {
        console.log(err);
      });
    });
    it('Load a plugin from npm', function(done) {
      this.timeout(20000);
      let topmark = new Topmark();
      topmark.register('topmark-scrollspeed').then((result) => {
        topmark.registrations['topmark-scrollspeed'].should.not.be.undefined;
        done();
      });
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
      let topmark = new Topmark(options);
      it('should register multiple plugins from an array of strings', function (done) {
        topmark.register([
          'simple-plugin',
          'another-plugin'
        ]).then((result) => {
          topmark.registrations.anotherPlugin.options.thing.should.equal(options.anotherPlugin.thing);
          topmark.registrations.simplePlugin.options.thing.should.equal(options.simplePlugin.thing);
          topmark.registrations.simplePlugin.name.should.equal('simplePlugin');
          topmark.registrations.anotherPlugin.name.should.equal('anotherPlugin');
          done();
        }).catch((err) => {
          console.log(err);
        });
      });
    });
  });
});

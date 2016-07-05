import chai from 'chai';
import Topmark from "../lib/topmark";
import chaiAsPromised from "chai-as-promised";

chai.should();
chai.use(chaiAsPromised);

describe('Topmark', () => {
  let port = 9222;
  let url = "http://topcoat.io"
  describe('constructor', () => {
    let topmark = new Topmark(port, url);
    it('should set port', () => {
      topmark.port.should.equal(port);
    });
    it('should set url', () => {
      topmark.url.should.equal(url);
    });
  });

  describe('connection', () => {
    let topmark;
    it('should fail if Chrome is using the wrong port', (done) => {
      let badPort = 9226
      topmark = new Topmark(badPort, url);
      topmark.chromeOpenConnection().then((resultPort) => {
        resultPort.should.be.null;
        done();
      }).catch((error) => {
        error.should.exist;
        done();
      });
    })
    it('should connect to Chrome with the correct port', function(done) {
      this.timeout(20000);
      topmark = new Topmark(port, url);
      topmark.chromeOpenConnection().then((resultPort) => {
        resultPort.should.equal(port);
        topmark.closeTab().then(topmark.closeConnection().then(done()));
      }).catch((error) => {
        console.error(error);
        error.should.be.null;
        done();
      });
    });
    it('should open a new tab in chrome', function(done) {
      this.timeout(20000);
      topmark = new Topmark(port, url);
      topmark.openTab().then((result) => {
        result.id.should.be.a('string');
        topmark.closeTab().then(topmark.closeConnection().then(done()));
      });
    });
  });

  describe('tests', function() {
    let topmark;
    before(()=>{
      topmark = new Topmark(9222, "http://topcoat.io");
    });
    afterEach((done)=>{
      topmark.closeConnection().then(done());
    });
    it('should return scroll performance analysis', function(done) {
      this.timeout(20000);
      topmark.scrolling().then((result) => {
        console.log(`Scrolling done ${result.frames.length}`);
        done();
      }).catch((error) => {
        consoe.log(error);
        done();
      });
    });
    it('should return page load time (in ms)', (done) => {
      this.timeout(1000);
      topmark.loading().should.eventually.be.a('number').notify(done);
      done();
    });
  });

});

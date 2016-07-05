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
    afterEach((done) => {
      topmark.closeTab().then(topmark.closeConnection().then(done()));
    });
    it('should fail if Chrome is using the wrong port', (done) => {
      let badPort = 9226
      topmark = new Topmark(badPort, url);
      topmark.chromeOpenConnection().should.be.rejectedWith(`Error: Cannot connect to Chrome on port ${badPort}`).notify(done);
    })
    it('should connect to Chrome with the correct port', function(done) {
      topmark = new Topmark(port, url);
      topmark.chromeOpenConnection().should.eventually.equal(port).notify(done);
    });
    it('should open a new tab in chrome', function(done) {
      topmark = new Topmark(port, url);
      topmark.openTab((result) => {
        console.log(result.toString());
        done()
      });
    });
  });

  describe('tests', function() {
    let topmark;
    beforeEach(()=>{
      topmark = new Topmark(9222, "http://topcoat.io");
    });
    afterEach((done)=>{
      topmark.closeTab().then(topmark.closeConnection().then(done()));
    });
    it('should return scroll performance analysis', function(done) {
      this.timeout(20000);
      topmark.loading().then((result) => {
        topmark.scrolling().then((result) => {
          done();
        });
      });
    });
    it('should return page load time (in ms)', (done) => {
      this.timeout(1000);
      topmark.loading().should.eventually.be.a('number').notify(done);
      done();
    });
  });

});

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
    it('should fail if Chrome is using the wrong port', (done) => {
      let badPort = 9226
      let topmark = new Topmark(badPort, url);
      topmark.chromeOpenConnection().should.be.rejectedWith(`Error: Cannot connect to Chrome on port ${badPort}`).notify(done);
    })
  });

  describe('tests', function() {
    before(()=>{
      this.topmark = new Topmark(9222, "http://topcoat.io");
    });
    afterEach(()=>{
      this.topmark.close();
    });
    this.timeout(10000);
    it('should return page load time (in ms)', (done) => {
      this.topmark.loading().should.eventually.be.a('number').notify(done);
    });
    it('should return scroll performance analysis', (done) => {
      this.topmark.loading().then(this.topmark.scrolling().should.eventually.be.a('object').notify(done));
    });
  });

});

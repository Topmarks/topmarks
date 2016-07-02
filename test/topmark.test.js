import chai from 'chai';
import Topmark from "../lib/topmark";

chai.should();

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
    it('should fail if it has the wrong port', (done) => {
      try {
        let topmark = new Topmark(9226, url);
        topmark.chromeOpenConnection(()=>{});
        should.fail('no error was thrown when it should have been')
      }
      catch (error) {
        done();
      }
    })
  });
});

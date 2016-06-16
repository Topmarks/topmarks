import chai from 'chai';
import Toplemetry from "../lib/toplemetry";

chai.should();

describe('Toplemetry', () => {
  let invalidChromiumSrc = '/new/path/to/chromium/';
  let validChromiumSrc = '/new/path/to/chromium/src/';
  it('sets properties in constructor', () => {
    let toplemetry = new Toplemetry(validChromiumSrc);
    toplemetry.chromiumSrc.should.equal(validChromiumSrc);
  });
  it('throws error for invalid chromiumSrc path', () => {
    let valid = true;
    try {
      new Toplemetry(invalidChromiumSrc);
    }
    catch(e){
      valid = false;
    }
    valid.should.be.false;
  });
});

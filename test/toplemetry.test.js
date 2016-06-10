import chai from 'chai';
import Toplemetry from "../lib/toplemetry";

chai.should();

describe('Toplemetry', () => {
  let chromiumSrc = '/new/path/to/chromiumsrc';
  let toplemetry;
  beforeEach(() => {
    toplemetry = new Toplemetry(chromiumSrc);
  });
  it('sets properties in constructor', () => {
    toplemetry.chromiumSrc.should.equal(chromiumSrc);
  });
});

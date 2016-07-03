import chai from 'chai';
import DevtoolsTimelineModel from 'devtools-timeline-model';
import FramesUtil from '../lib/frames-util';
import fs from 'fs';
import path from 'path';

chai.should();

let file = path.join(__dirname, 'fixtures', 'devtools-timeline.trace');

describe('FramesUtil', () => {
  let model, frames;
  before(function(done) {
    this.timeout(10000);
    model = new DevtoolsTimelineModel(JSON.parse(fs.readFileSync(file, 'utf8')));
    frames = new FramesUtil(model.frameModel()._frames);
    done();
  });
  it('should accept frames in the constructor', () => {
    frames.frames.length.should.equal(207);
  });
  it('should calculate average frame rate', () => {
    frames.getAverageFrameRate().should.equal(46.47);
  });
  it('should return total frame count', () => {
    frames.getTotalFrameCount().should.equal(207);
  });
  it('should count large frames', () => {
    frames.getTotalLargeFrameCount().should.equal(32);
  });
  describe('frame breakdown', () => {
    let breakdown;
    before(() => {
      breakdown = frames.getBreakDownPercentage();
    });
    it('should calculate idle frames', () => {
      breakdown.idle.should.equal('13.97%');
    });
    it('should calculate painting frames', () => {
      breakdown.painting.should.equal('33.91%');
    });
    it('should calculate rendering frames', () => {
      breakdown.rendering.should.equal('13.3%');
    });
    it('should calculate scripting frames', () => {
      breakdown.scripting.should.equal('29.07%');
    });
    it('should calculate loading frames', () => {
      breakdown.loading.should.equal('0.42%');
    });
    it('should calculate other frames', () => {
      breakdown.other.should.equal('9.33%');
    });
  });
});

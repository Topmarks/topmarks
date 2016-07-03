import chai from 'chai';
import DevtoolsTimelineModel from 'devtools-timeline-model';
import FramesUtil from '../lib/frames-util';
import fs from 'fs';
import path from 'path';

chai.should();

let file = path.join(__dirname, 'fixtures', 'devtools-timeline.trace');

describe('FramesUtil', () => {
  let model;
  before(() => {
    model = new DevtoolsTimelineModel(JSON.parse(fs.readFileSync(file, 'utf8')));
  });
  it('should accept frames in the constructor', () => {
    let frames = new FramesUtil(model.frameModel()._frames);
    frames.frames.length.should.equal(model.frameModel()._frames.length)
  });
});

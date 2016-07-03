export default class FramesUtil {
  constructor(frames){
    this.frames = frames;
    this.framesAnalysis = this._analyzeFrames(this.frames);
  }
  _analyzeFrames(frames){
    let result = {
      repaints: 0,
      largeFrames: [],
      totalDuration: 0,
      timeByCategory: {
        idle: 0,
        other: 0,
        painting: 0,
        rendering: 0,
        scripting: 0,
        loading: 0
      },
    };
    frames.forEach((frame, index) => {
      if(frame.duration > 18){
        result.largeFrames.push(frame);
      }
      result.totalDuration += frame.duration;
      result.repaints += frame.paints.length;

      let categoryTotal = 0;

      for (let category in frame.timeByCategory) {
        result.timeByCategory[category] += frame.timeByCategory[category];
        categoryTotal += frame.timeByCategory[category];
      }
      result.timeByCategory.idle += frame.duration - categoryTotal;
    });

    return result;
  }
  _roundDigits(integer, count = 2){
    let power = Math.pow(10,count);
    return Math.round(integer * power)/power;
  }
  getAverageFrameRate() {
    return this._roundDigits(1/((this.framesAnalysis.totalDuration / this.frames.length) / 1000));
  }
  getTotalFrameCount() {
    return this.frames.length;
  }
  getTotalLargeFrameCount () {
    return this.framesAnalysis.largeFrames.length;
  }
  getBreakDownPercentage () {
    let result = {};
    for (let category in this.framesAnalysis.timeByCategory) {
      let categoryTime = this.framesAnalysis.timeByCategory[category];
      let totalTime = this.framesAnalysis.totalDuration;
      result[category] = this._roundDigits((categoryTime/totalTime) * 100) + "%";
    }
    return result;
  }
}

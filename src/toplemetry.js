class Toplemetry {
  constructor(chromiumSrc){
    if (!chromiumSrc.match(/(\/src\/{0,1})$/)) {
      throw('CHROMIUM_SRC path not valid. Path Must end in /src check again.');
    }
    this.chromiumSrc = chromiumSrc;
  }
}

export default Toplemetry;

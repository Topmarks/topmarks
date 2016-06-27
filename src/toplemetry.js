import Chrome from 'chrome-remote-interface';
import DevtoolsTimelineModel from 'devtools-timeline-model';
import FramesUtil from './frames-util';

let TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];

export default class Toplemetry {
  constructor(port, url){
    this.port = (typeof port !== 'undefined')?  port : 9222;
    this.url = (typeof url !== 'undefined')?  url : 'http://topcoat.io';
  }
  chromeSetup(callback){
    if (typeof this.chrome == 'undefined'){
      this.chromeOpenConnection(callback);
    } else {
      if(this.chrome.ws.readyState > 1) {
        this.chromeOpenConnection(callback);
      }
      return callback();
    }
  }
  chromeOpenConnection(callback){
    Chrome.New({},(err, tab)=>{
      this.tab = tab;
      Chrome(chrome => {
        this.chrome = chrome;
        callback();
      }).on('error', () => {
        console.error('Cannot connect to Chrome');
      });
    });
  }
  runAll(callback){
    this.loading(()=> {
      this.scrolling(()=>{
        Chrome.Close({id: this.tab.id},()=>{
          this.chrome.close();
          callback();
        });
      });
    });
  }
  loading(callback){
    let requestStartTime,
        requestEndTime,
        requestTotalTime;
    this.chromeSetup(()=>{
      this.chrome.Network.enable();
      this.chrome.Page.enable();
      this.chrome.Network.requestWillBeSent(params => {
        requestStartTime = (typeof requestStartTime != 'undefined')? requestStartTime: params.timestamp;
      });
      this.chrome.Page.loadEventFired( params => {
        requestEndTime = params.timestamp;
        this.loadtime = parseFloat(requestEndTime) - parseFloat(requestStartTime);
        this.chrome.Runtime.evaluate({expression: "document.body.clientHeight - window.innerHeight"}, (err, params)=>{
          if(!err && params.result.value > 0){
            this.scrollHeight = -Math.abs(parseInt(params.result.value));
          } else {
            throw new Error('Page is too small to scroll');
          }
          callback();
        });
      });
      this.chrome.once('ready', () => {
        this.chrome.Page.navigate({url: this.url});
      });
    });
  }
  scrolling(callback){
    this.chromeSetup(()=>{

      let rawEvents = [];

      this.chrome.Tracing.dataCollected(function(data){
        var events = data.value;
        rawEvents = rawEvents.concat(events);

      });

      this.chrome.Tracing.start({
        "categories": TRACE_CATEGORIES.join(','),
        "options": "sampling-frequency=10000"
      });
      this.chrome.Input.synthesizeScrollGesture({x: 0, y: 0, xDistance: 0, yDistance: this.scrollHeight, gestureSourceType: 'mouse', speed: 1600},(err,params)=>{
        this.chrome.Tracing.end();
      });

      this.chrome.Tracing.tracingComplete(function () {
        let model = new DevtoolsTimelineModel(rawEvents);
        let frames = new FramesUtil(model.frameModel()._frames);
        console.log(`Total Frame Count ${frames.getTotalFrameCount()}`);
        console.log(`Average Frame Rate ${frames.getAverageFrameRate()} fps`);
        console.log(`Total Large Frame Count ${frames.getTotalLargeFrameCount()}`);
        console.log('Frame time breakdown');
        console.log(frames.getBreakDownPercentage());
        callback();
      });

    });
  }
}

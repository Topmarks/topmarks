import Chrome from 'chrome-remote-interface';
import DevtoolsTimelineModel from 'devtools-timeline-model';
import FramesUtil from './frames-util';

let TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];

export default class Topmark {
  constructor(port, url){
    this.port = (typeof port !== 'undefined')?  port : 9222;
    this.url = (typeof url !== 'undefined')?  url : 'http://topcoat.io';
  }

  chromeOpenConnection() {
    return new Promise((resolve, reject) => {
      let connected = true;

      //Check if already connected, or port is closed.
      if (typeof this.chrome == 'undefined'){
        connected = false;
      } else {
        if(this.chrome.ws.readyState > 1) {
          connected = false;
        }
      }

      if (!connected) {

        Chrome.New({port: this.port},(err, tab) => {
          this.tab = tab;
          Chrome({port: this.port}, (chrome) => {
            this.chrome = chrome;
            resolve(this.port);
          }).on('error', () => {
            reject(Error(`Cannot connect to Chrome on port ${this.port}`));
          });
        });

      } else {
        resolve(this.port);
      }
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.chromeOpenConnection()
        .then(Chrome.Close({port: this.port, id: this.tab.id}))
        .then(this.chrome.close());
    });
  }

  loading() {
    return new Promise((resolve, reject) => {
      let requestStartTime,
          requestEndTime;
      this.chromeOpenConnection().then(() => {
        this.chrome.Network.enable();
        this.chrome.Page.enable();
        this.chrome.Network.requestWillBeSent(params => {
          requestStartTime = (typeof requestStartTime != 'undefined')? requestStartTime: params.timestamp;
        });
        this.chrome.Page.loadEventFired( params => {
          requestEndTime = params.timestamp;
          this.loadtime = parseFloat(requestEndTime) - parseFloat(requestStartTime);
          this.chrome.Runtime.evaluate({expression: "document.body.clientHeight - window.innerHeight"}, (err, params)=>{
            if(!err){
              this.scrollHeight = -parseInt(params.result.value);
            } else {
              reject(Error('Could not determine page height'));
            }
            resolve(this.loadtime);
          });
        });
        this.chrome.once('ready', () => {
          this.chrome.Page.navigate({url: this.url});
        });
      }).catch((error)=>{reject(error)});
    });
  }
  scrolling(callback){
    return new Promise((resolve, reject) => {
      if(this.scrollHeight >= 0){
        reject(Error(`[${this.url}]'s scrollable area is ${this.scrollHeight}`));
      } else {
        this.chromeOpenConnection().then(() => {

          let rawEvents = [];

          this.chrome.Tracing.dataCollected(function(data){
            var events = data.value;
            rawEvents = rawEvents.concat(events);
          });

          this.chrome.Tracing.start({
            "categories": TRACE_CATEGORIES.join(','),
            "options": "sampling-frequency=10000"
          });
          this.chrome.Input.synthesizeScrollGesture({x: 0, y: 0, xDistance: 0, yDistance: this.scrollHeight, gestureSourceType: 'mouse', speed: 1600},(err,params) => {
            this.chrome.Tracing.end();
          });

          this.chrome.Tracing.tracingComplete(() => {
            let model = new DevtoolsTimelineModel(rawEvents);
            let frames = new FramesUtil(model.frameModel()._frames);
            resolve(frames);
          });

        }).catch((error)=>{reject(error)});
      }
    });
  }
}

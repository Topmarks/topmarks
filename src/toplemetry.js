import Chrome from 'chrome-remote-interface';

export default class Toplemetry {
  constructor(port, url){
    this.port = (typeof port !== 'undefined')?  port : 9222;
    this.url = (typeof url !== 'undefined')?  url : 'http://topcoat.io';
    let TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];
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
    console.log('start async');
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
        callback();
      });
      this.chrome.once('ready', () => {
        this.chrome.Page.navigate({url: this.url});
      });
    });
  }
  scrolling(callback){
    this.chromeSetup(()=>{
      console.log('hello');
      Tracing.start({
        "categories": TRACE_CATEGORIES.join(','),
        "options": "sampling-frequency=10000"
      });
    });
  }
}

let instance = null;

export default class ChatAPI {
  constructor() {

    if (instance) return instance;

    instance = this;

    this.state = {
      connected: false,
      errored: false,
      closed: false,
    };

    this.listeners = [];

    this.connection = new WebSocket('wss://hsc-backend.herokuapp.com/', 'hsc-protocol');

    this.connection.onopen = this.onOpen;
    this.connection.onerror = this.onError;
    this.connection.onclose = this.onClose;
    this.connection.onmessage = this.onMessage;
  }

  sendMessage(msg = {}, cb) {
    console.log('Sending message: ', JSON.stringify(msg));

    if (cb) {
      this.listeners.push({
        type: msg.type,
        callback: cb
      })
    }
    this.connection.send(JSON.stringify(msg));
  }

  on(evt, cb, opts = {}) {
    if (cb) {
      this.listeners.push({
        type: evt,
        opts: opts,
        callback: cb
      })
    }
  }

  logOnEvent = (evt_name) => {
    console.log(evt_name, ' - ChatAPI: ', this.state);
  };

  onOpen = (evt) => {
    this.state.connected = true;
    this.listeners.map((el, i) => {
      if (el.type === 'connect') {
        el.callback(this.state);
        this.listeners.splice(i, 1);
      }
    });

    this.logOnEvent('open');
  };

  onMessage = (evt) => {
    this.logOnEvent('message');

    if (this.listeners.length === 0) return;

    let data = JSON.parse(evt.data);

    switch (data.type) {
      case 'join':
        this.listeners.map((el, i) => {
          if (el.type === 'join') {
            el.callback(data);
            this.listeners.splice(i, 1);
          }
        });
        break;
      case 'message':
        this.listeners.map((el) => {
          if (el.type === 'message') {
            el.callback(data);
            if ((el.opts.hasOwnProperty('duration') && el.opts.duration !== 'infinite') || !el.opts.hasOwnProperty('duration'))
              this.listeners.splice(i, 1);
          }
        });
        break;
      default:
        return;
    }
  };

  onError = (evt) => {
    this.state.errored = true;
    this.listeners.map((el, i) => {
      if (el.type === 'error') {
        el.callback(this.state);
        this.listeners.splice(i, 1);
      }
    });
    this.logOnEvent('error');
    console.log('error:', evt.message)
  };

  onClose = (evt) => {
    this.state.connected = false;
    this.listeners.map((el, i) => {
      if (el.type === 'close') {
        el.callback(this.state);
        this.listeners.splice(i, 1);
      }
    });
    this.state.closed = true;
    this.logOnEvent('close');
  };
}
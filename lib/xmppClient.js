const { client } = require('@xmpp/client');

const callMethodOrAnother = (firstMethod, secondMethod, data, self) => {
  if (firstMethod) {
    firstMethod(data, self);
  } else {
    secondMethod(data, self);
  }
};

class XmppClient {
  constructor(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.xmpp = client({
      service: config.url || 'xmpp://localhost:5222',
      domain: config.domain || 'localhost',
      resource: config.resource,
      username: config.username,
      password: config.password,
    });
    this._createListener();
    this.xmpp.start().catch(console.error);
  }

  _createListener() {
    const self = this;
    this.xmpp.on('error', err => callMethodOrAnother(this.callbacks.onError, this._onError, err, self));
    this.xmpp.on('online', address => callMethodOrAnother(this.callbacks.onConnected, this._onConnected, address, self));
    this.xmpp.on('offline', err => callMethodOrAnother(this.callbacks.onOffline, this._logXmppData, err, self));
    this.xmpp.on('stanza', stanza => callMethodOrAnother(this.callbacks.onReceived, this._onReceived, stanza, self));
    this.xmpp.on('status', status => callMethodOrAnother(this.callbacks.onStatus, this._logXmppData, status, self));
    this.xmpp.on('input', input => callMethodOrAnother(this.callbacks.onInput, this._logXmppData, input, self));
    this.xmpp.on('output', output => callMethodOrAnother(this.callbacks.onOutput, this._logXmppData, output, self));
  }

  _logXmppData(data) {
    console.debug('🛈', data);
  }

  _onReceived(stanza, self) {
    if (stanza.is('message')) {
      console.log(`[${self.username}] Message Received : "${stanza.getChild('body')}"`);
    }
  }

  _onError(err) {
    console.error('❌', err.toString());
  }

  _onConnected(address) {
    console.log('▶', 'online as', address.toString());
    this.address = address;
  }

  async sendMessage(message) {
    return await this.xmpp.send(message);
  }
}

module.exports = XmppClient;

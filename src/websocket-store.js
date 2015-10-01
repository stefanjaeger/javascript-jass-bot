'use strict';
var WebSocket = require('ws');

class WebSocketStore {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.debug = false;

        this.dispatcher.register('debug', (pl) => this.onDebug(pl));
        this.dispatcher.register('connectJassServer', (pl) => this.onConnectJassServer(pl));
        this.dispatcher.register('sendResponse', (pl) => this.onSendResponse(pl));
        this.dispatcher.register('closeConnection', (pl) => this.onCloseConnection(pl));
    }

    onDebug(pl) {
        this.debug = pl;
    }

    onConnectJassServer(pl) {
        this.webSocket = new WebSocket(`ws://${pl}`);
        this.webSocket.onmessage = event => {
            if (this.debug) console.log('WS receiving', event.data);
            let message = JSON.parse(event.data);
            this.dispatcher.emit(message.type, message.data);
        };
    }

    onSendResponse(pl) {
        let content = JSON.stringify(pl);
        if (this.debug) console.log('WS sending', content);
        this.webSocket.send(content);
    }
    
    onCloseConnection(pl) {
        this.webSocket.close();
    }
}

module.exports = WebSocketStore;
'use strict';
var WebSocket = require('ws');

class WebSocketStore {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        dispatcher.register('sendResponse', (pl) => this.onSendResponse(pl))
    }

    connect(url) {
        this.webSocket = new WebSocket(`ws://${url}`);
        this.webSocket.onmessage = event => {
            console.log('receiving', event.data);
            let message = JSON.parse(event.data);
            this.dispatcher.emit(message.type, message.data);
        };
    }

    onSendResponse(payload) {
        let content = JSON.stringify(payload);
        console.log('sending', content);
        this.webSocket.send(content);
    }
}

module.exports = WebSocketStore;
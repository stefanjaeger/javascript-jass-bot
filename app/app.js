'use strict';

class WebSocketHandler {
    constructor(url) {
        this.socket = new WebSocket(`ws://${url}`);
    }

    onMessage(fn) {
        this.socket.onmessage = function(event) {
            console.log('receiving', event.data);
            fn(JSON.parse(event.data));
        };
    }

    send(data) {
        let payload = JSON.stringify(data);
        console.log('sending', payload);
        this.socket.send(payload);
    }
}

class RequestPlayerName {
    constructor(webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    act() {
        let response = {};
        response.type = 'CHOOSE_PLAYER_NAME';
        response.data = 'js jass bot';
        this.webSocketHandler.send(response);
    }

}

let webSocketHandler = new WebSocketHandler('localhost:3000');
webSocketHandler.onMessage(function (message) {
    switch (message.type) {
        case 'REQUEST_PLAYER_NAME':
            let command = new RequestPlayerName(webSocketHandler);
            command.act();
            break;
        default:
            console.log(`unknonw message type ${message.type}`);
    };
});
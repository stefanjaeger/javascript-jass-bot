'use strict';

class Dispatcher {
    constructor() {
        this.listeners = {};
    }

    emit(action, payload) {
        if (!this.listeners[action]) {
            console.error(`no listener attachted for action ${action}`);
            return;
        }
        this.listeners[action].forEach((listener) => {
            listener(payload);
        });
    }

    register(action, listener) {
        if (!this.listeners[action]) {
            this.listeners[action] = [];
        }
        this.listeners[action].push(listener);
    }
}

class GameStore {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.dispatcher.register('REQUEST_PLAYER_NAME', pl => this.onRequestPlayerName(pl));
    }

    onRequestPlayerName(payload) {
        let response = {};
        response.type = 'CHOOSE_PLAYER_NAME';
        response.data = 'js jass bot';
        this.dispatcher.emit('sendResponse', response);

    }
}

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

    onSendResponse(data) {
        let payload = JSON.stringify(data);
        console.log('sending', payload);
        this.webSocket.send(payload);
    }
}

let dispatcher = new Dispatcher();
let gameStore = new GameStore(dispatcher);
let webSocketStore = new WebSocketStore(dispatcher);

webSocketStore.connect('localhost:3000');

'use strict';

let GameStore = require('./src/game-store');
let WebSocketStore = require('./src/websocket-store');
let Dispatcher = require('./src/dispatcher');


class Bot {

    constructor(botName) {
        this.botName = botName;
    }

    withStrategy(Strategy) {
        this.Strategy = Strategy;
        return this;
    }

    connect(connectionstring) {
        let dispatcher = new Dispatcher();
        let gameStore = new GameStore(dispatcher);
        let webSocketStore = new WebSocketStore(dispatcher);

        webSocketStore.connect(connectionstring);
    }
}

module.exports = Bot;

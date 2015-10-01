'use strict';

let GameStore = require('./src/game-store');
let WebSocketStore = require('./src/websocket-store');
let Dispatcher = require('./src/dispatcher');


class Bot {

    constructor(playerName) {
        this.playerName = playerName;
    }

    withStrategy(Strategy) {
        this.Strategy = Strategy;
        return this;
    }

    connect(connectionstring) {
        let dispatcher = new Dispatcher();
        let gameStore = new GameStore(dispatcher, this.playerName, this.Strategy);
        let webSocketStore = new WebSocketStore(dispatcher);

        dispatcher.emit('connectJassServer', connectionstring);
    }
}

module.exports = Bot;

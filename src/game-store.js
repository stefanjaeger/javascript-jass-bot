'use strict';

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

module.exports = GameStore;
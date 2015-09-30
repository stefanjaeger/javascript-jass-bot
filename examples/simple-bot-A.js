'use strict';

let Bot = require('../index.js');

class BotAStrategy {
    static requestTrumpf(cards) {
        let response = {};
        response.mode = 'TRUMPF';
        response.trumpfColor = 'SPADES';
        return response;
    }
}

new Bot('A').withStrategy(BotAStrategy).connect('localhost:3000');
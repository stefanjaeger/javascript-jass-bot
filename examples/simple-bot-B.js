'use strict';

let Bot = require('../index.js');

class BotBStrategy {
    static requestTrumpf(cards) {
        let response = {};
        response.mode = 'OBEABE';
        return response;
    }
}
new Bot('B').withStrategy(BotBStrategy).connect('localhost:3000');
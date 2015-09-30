'use strict';

let Bot = require('../index.js');

class BotBStrategy {
    static requestTrumpf(cards) {
        let response = {};
        response.mode = 'OBEABE';
        return response;
    }
    
    static playCard(myCards, gameState) {
        // play random
        return myCards[Math.floor(Math.random()*myCards.length)];
    }
}
new Bot('B').withStrategy(BotBStrategy).connect('localhost:3000');
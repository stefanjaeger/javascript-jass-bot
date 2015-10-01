'use strict';

let Bot = require('../index.js');

class BotBStrategy {
    requestTrumpf(cards) {
        let response = {};
        response.mode = 'OBEABE';
        return response;
    }
    
    playCard(myCards, gameState) {
        // play random
        return myCards[Math.floor(Math.random()*myCards.length)];
    }
}
new Bot('B').withStrategy(new BotBStrategy()).connect('localhost:3000');
'use strict';

let Bot = require('../index.js');

class BotAStrategy {
    requestTrumpf(cards) {
        let response = {};
        response.mode = 'TRUMPF';
        response.trumpfColor = 'SPADES';
        return response;
    }
    
    playCard(myCards, gameState) {
        // play random
        return myCards[Math.floor(Math.random()*myCards.length)];
    }
}

new Bot('A').withStrategy(new BotAStrategy()).connect('localhost:3000');
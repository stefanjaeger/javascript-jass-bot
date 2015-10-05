'use strict';

let Bot = require('../index.js');

class BotAStrategy {
    requestTrumpf(cards) {
        let response = {};
        response.mode = 'TRUMPF';
        response.trumpfColor = 'SPADES';
        return response;
    }
    
    playCard(myCards, playedCards, gameState) {
        // play random
        return myCards[Math.floor(Math.random()*myCards.length)];
    }

    gameFinished(data) {
        let ownBotIndex = (data[0].name.indexOf('BotName') > 0) ? 0 : 1;
        let otherBotIndex = (ownBotIndex === 0) ? 1 : 0;
        let winner = (data[ownBotIndex].points > data[otherBotIndex].points) ? data[ownBotIndex].name : data[otherBotIndex].name;

        console.log(`${data[ownBotIndex].points} vs. ${data[otherBotIndex].points}. Winner: ${winner}`);
    }

    notifyError(error) {
        console.log(error);
    }
}

new Bot('B').withStrategy(new BotAStrategy()).connect('localhost:3000');
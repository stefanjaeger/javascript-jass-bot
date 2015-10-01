# javascript-jass-bot
Javascript Client for https://github.com/webplatformz/challenge

## Requirements
- Node v4.1.x or higher

## Installation
- initialize new npm project with `npm init`
- `npm install javascript-jass-bot -S`
- create index.js file with content:
```
'use strict';

let Bot = require('javascript-jass-bot');

class BotStrategy {
    requestTrumpf(cards) {
        // e.g. choose TRUMPF SPADES
        let response = {};
        response.mode = 'TRUMPF';
        response.trumpfColor = 'SPADES';
        return response;
    }
    
    playCard(myCards, playedCards, gameState) {
        // e.g. play random
        return myCards[Math.floor(Math.random()*myCards.length)];
    }
    
    
    gameFinished(data) {
        console.log(data);
    }

    notifyError(error) {
        console.log(error);
    }
}

new Bot('BotName').withStrategy(new BotStrategy()).connect('localhost:3000');
```
- run it with `node index.js` (or use `nodemon`)

## Contribute
1. Clone repo
2. npm start

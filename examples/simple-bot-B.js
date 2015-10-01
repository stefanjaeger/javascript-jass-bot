'use strict';

// DISCLAIMER: very hacky Bot to test if it's theoretically possible to build a bot. Don't use it.

let Bot = require('../index.js');
let _ = require('lodash');

class BotStrategy {
    requestTrumpf(cards) {
        // simple heuristic to choose a strategy
        let response = {};

        let stats = this.calculateCardStatistics(cards);
        if (stats.alli.sechser.length + stats.alli.siebner.length + stats.alli.achter.length > 4) {
            response.mode = 'UNDEUFE';
        } else if (stats.alli.asse.length + stats.alli.koenige.length + stats.alli.damen.length > 4) {
            response.mode = 'OBEABE';
        } else {
            response.mode = 'TRUMPF';
            if (stats.alli.buur.length > 0) {
                // Trumpf mit Bauer
                response.trumpfColor = stats.alli.buur[0].color;
            } else {
                // Trumpf mit den meisten Karten
                response.trumpfColor = stats.anzahl[0].color;
            }
        }

        return response;
    }

    calculateCardStatistics(cards) {
        let result = {};

        result.alli = {};
        result.alli.asse = _.filter(cards, n => n.number === 14);
        result.alli.koenige = _.filter(cards, n => n.number === 13);
        result.alli.damen = _.filter(cards, n => n.number === 12);
        result.alli.buur = _.filter(cards, n => n.number === 11);
        result.alli.zehner = _.filter(cards, n => n.number === 10);
        result.alli.neuner = _.filter(cards, n => n.number === 9);
        result.alli.achter = _.filter(cards, n => n.number === 8);
        result.alli.siebner = _.filter(cards, n => n.number === 7);
        result.alli.sechser = _.filter(cards, n => n.number === 6);

        let byColor = function (color) {
            let result = {}
            result.asse = _.filter(cards, n => n.number === 14 && n.color === color);
            result.koenige = _.filter(cards, n => n.number === 13 && n.color === color);
            result.damen = _.filter(cards, n => n.number === 12 && n.color === color);
            result.buur = _.filter(cards, n => n.number === 11 && n.color === color);
            result.zehner = _.filter(cards, n => n.number === 10 && n.color === color);
            result.neuner = _.filter(cards, n => n.number === 9 && n.color === color);
            result.achter = _.filter(cards, n => n.number === 8 && n.color === color);
            result.siebner = _.filter(cards, n => n.number === 7 && n.color === color);
            result.sechser = _.filter(cards, n => n.number === 6 && n.color === color);
            return result;
        }

        result.egga = byColor('DIAMONDS');
        result.herz = byColor('HEARTS');
        result.schufla = byColor('CLUBS');
        result.chruez = byColor('SPADES');
        
        result.getTrumpfStats = function(color) {
            if (color === 'DIAMONDS') return result.egga;
            if (color === 'HEARTS') return result.herz;
            if (color === 'CLUBS') return result.schufla;
            if (color === 'SPADES') return result.chruez;
        }

        result.anzahl = _.sortByOrder(_.map(_.groupBy(cards, 'color'), (v, k) => {
            return {
                'color': k,
                'length': v.length
            };
        }), 'length', 'desc');

        return result;
    }

    playCard(myCards, playedCards, gameState) {
        let stats = this.calculateCardStatistics(myCards);

        if (gameState.currentTrumpfMode === 'UNDEUFE' && playedCards.length === 0) {
            if (stats.alli.sechser.length > 0) {
                return stats.alli.sechser[0];
            }
            if (stats.alli.siebner.length > 0) {
                return stats.alli.siebner[0];
            }
            if (stats.alli.achter.length > 0) {
                return stats.alli.achter[0];
            }
        }

        if (gameState.currentTrumpfMode === 'OBEABE' && playedCards.length === 0) {
            if (stats.alli.asse.length > 0) {
                return stats.alli.asse[0];
            }
            if (stats.alli.koenige.length > 0) {
                return stats.alli.koenige[0];
            }
            if (stats.alli.damen.length > 0) {
                return stats.alli.damen[0];
            }
        }

        if (gameState.currentTrumpfMode === 'TRUMPF' && playedCards.length === 0) {
            let trumpfStats = stats.getTrumpfStats(gameState.currentTrumpfColor);
            
            if (trumpfStats.buur.length > 0) {
                return trumpfStats.buur[0];
            }
            if (trumpfStats.neuner.length > 0) {
                return trumpfStats.neuner[0];
            }
            if (trumpfStats.asse.length > 0) {
                return trumpfStats.asse[0];
            }
        }


        // e.g. play random
        return myCards[Math.floor(Math.random() * myCards.length)];
    }

    gameFinished(data) {
        let ownBotIndex = (data[0].name.indexOf('BotName') > 0) ? 0 : 1;
        let otherBotIndex = (ownBotIndex === 0) ? 1 : 0;
        let winner = (data[ownBotIndex].points > data[otherBotIndex].points) ? data[ownBotIndex].name : data[otherBotIndex].name;

        console.log(`${data[ownBotIndex].points} vs. ${data[otherBotIndex].points}. Winner: ${winner}`);
    }

    notifyError(error) {
        // console.log(error);
    }
}

new Bot('BotName').withStrategy(new BotStrategy()).connect('localhost:3000');
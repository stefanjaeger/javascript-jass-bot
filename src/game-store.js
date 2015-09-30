'use strict';

class GameStore {
    constructor(dispatcher, playerName, Strategy) {
        this.dispatcher = dispatcher;
        this.playerName = playerName;
        this.Strategy = Strategy;
        
        this.dispatcher.register('REQUEST_PLAYER_NAME', pl => this.onRequestPlayerName(pl));
        this.dispatcher.register('REQUEST_SESSION_CHOICE', pl => this.onRequestSessionChoise(pl));
        this.dispatcher.register('DEAL_CARDS', pl => this.onDealCards(pl));
        this.dispatcher.register('REQUEST_TRUMPF', pl => this.onRequestTrumpf(pl));
        this.dispatcher.register('BROADCAST_TRUMPF', pl => this.onBroadcastTrumpf(pl));
    }

    onRequestPlayerName(payload) {
        let response = {};
        response.type = 'CHOOSE_PLAYER_NAME';
        response.data = this.playerName;
        this.dispatcher.emit('sendResponse', response);
    }
    
    onRequestSessionChoise(payload) {
        let response = {};
        response.type = 'CHOOSE_SESSION';
        response.data = {};
        response.data.sessionChoice = 'AUTOJOIN';
        response.data.sessionName = 'should not matter';
        response.data.sessionType = 'TOURNAMENT';
        this.dispatcher.emit('sendResponse', response);
    }
    
    onDealCards(payload) {
        this.myCards = payload;
    }
    
    onRequestTrumpf(payload) {
        let response = {};
        response.type = 'CHOOSE_TRUMPF';
        response.data = this.Strategy.requestTrumpf(this.myCards);
        this.dispatcher.emit('sendResponse', response);
    }
    
    onBroadcastTrumpf(pl) {
        this.currentTrumpfMode = pl.mode;
        this.currentTrumpfColor = pl.trumpfColor;
    }
}

module.exports = GameStore;
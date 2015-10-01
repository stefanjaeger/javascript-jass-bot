'use strict';

class GameStore {
    constructor(dispatcher, playerName, strategy) {
        this.dispatcher = dispatcher;
        this.playerName = playerName;
        this.strategy = strategy;
        
        this.gameState = {};
        
        this.dispatcher.register('debug', (pl) => this.onDebug(pl));
        this.dispatcher.register('REQUEST_PLAYER_NAME', pl => this.onRequestPlayerName(pl));
        this.dispatcher.register('REQUEST_SESSION_CHOICE', pl => this.onRequestSessionChoise(pl));
        this.dispatcher.register('BROADCAST_SESSION_JOINED', pl => this.onBroadcastSessionJoined(pl));
        this.dispatcher.register('BROADCAST_TEAMS', pl => this.onBroadcastTeams(pl));
        this.dispatcher.register('DEAL_CARDS', pl => this.onDealCards(pl));
        this.dispatcher.register('REQUEST_TRUMPF', pl => this.onRequestTrumpf(pl));
        this.dispatcher.register('BROADCAST_TRUMPF', pl => this.onBroadcastTrumpf(pl));
        this.dispatcher.register('REQUEST_CARD', pl => this.onRequestCard(pl));
        this.dispatcher.register('REJECT_CARD', pl => this.onRejectCard(pl));
        this.dispatcher.register('PLAYED_CARDS', pl => this.onPlayedCards(pl));
        this.dispatcher.register('BROADCAST_STICH', pl => this.onBroadcastStitch(pl));
        this.dispatcher.register('BROADCAST_GAME_FINISHED', pl => this.onBroadcastGameFinished(pl));
        this.dispatcher.register('BROADCAST_WINNER_TEAM', pl => this.onBroadcastWinnerTeam(pl));
    }

    onDebug(pl) {
        this.debug = pl;
    }

    onRequestPlayerName(pl) {
        let response = {};
        response.type = 'CHOOSE_PLAYER_NAME';
        response.data = this.playerName;
        this.dispatcher.emit('sendResponse', response);
    }
    
    onRequestSessionChoise(pl) {
        let response = {};
        response.type = 'CHOOSE_SESSION';
        response.data = {};
        response.data.sessionChoice = 'AUTOJOIN';
        response.data.sessionName = 'should not matter';
        response.data.sessionType = 'TOURNAMENT';
        this.dispatcher.emit('sendResponse', response);
    }
    
    onBroadcastSessionJoined(pl) {
        // do nothing right now
    }
    
    onBroadcastTeams(pl) {
        // do nothing right now
    }
    
    onDealCards(payload) {
        this.myCards = payload;
    }
    
    onRequestTrumpf(pl) {
        let response = {};
        response.type = 'CHOOSE_TRUMPF';
        response.data = this.strategy.requestTrumpf(this.myCards);
        this.dispatcher.emit('sendResponse', response);
    }
    
    onBroadcastTrumpf(pl) {
        this.gameState.currentTrumpfMode = pl.mode;
        this.gameState.currentTrumpfColor = pl.trumpfColor;
    }
    
    onRequestCard(pl) {
        let response = {};
        response.type = 'CHOOSE_CARD';
        let cardToPlay = this.strategy.playCard(this.myCards, this.gameState);
        response.data = cardToPlay;
        
        this.myCards.splice(this.myCards.indexOf(cardToPlay), 1);
        
        this.dispatcher.emit('sendResponse', response);
    }
    
    onRejectCard(pl) {
        this.myCards.push(pl);
    }
    
    onPlayedCards(pl) {
        this.gameState.playedCards = pl;
    }
    
    onBroadcastStitch(pl) {
        this.gameState.playedCards = [];
        
        if(!this.gameState.stitch) {
            this.gameState.stitch = [];
        }
        this.gameState.stitch.push(pl.playedCards);
    }
    
    onBroadcastGameFinished(pl) {
        this.gameState = {};
    }
    
    onBroadcastWinnerTeam(pl) {
        if (this.debug) console.log('game result:', pl);
        this.dispatcher.emit('closeConnection');
    }
}

module.exports = GameStore;
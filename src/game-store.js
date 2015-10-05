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
        this.dispatcher.register('BAD_MESSAGE', pl => this.onBadMessage(pl));
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
        this.gameState.lastPlayerPosition = pl.length;
        
        // fallback. After 5 retries (e.g. bot sends always same card), choose card by our own
        let cardToPlay = (this.rejectCounter && this.rejectCounter >= 5) ? this.playCardFallback(pl) : this.strategy.playCard(this.myCards, pl, this.gameState);

        let response = {};
        response.type = 'CHOOSE_CARD';
        response.data = cardToPlay;

        this.myCards.splice(this.myCards.indexOf(cardToPlay), 1);

        this.dispatcher.emit('sendResponse', response);
    }

    playCardFallback(pl) {
        // fallback is quite simple, just try a random card for so long until it's working
        // (without this fallback, our game could get stuck)
        if (this.rejectCounter == 5) {
            let errorMessage = `BOT FAILURE!! using fallback (random card), because Bot played 5 times an invalid card. Some debug infos: \nmyCards:${JSON.stringify(this.myCards)} \nplayedCards:${JSON.stringify(pl)} \ngameState: ${JSON.stringify(this.gameState)})`;
            if (this.debug) console.log(errorMessage);
            if (this.strategy.notifyError) this.strategy.notifyError(errorMessage);
        }
        return this.myCards[Math.floor(Math.random() * this.myCards.length)];
    }

    onRejectCard(pl) {
        this.myCards.push(pl);
        this.rejectCounter++;
    }

    onPlayedCards(pl) {
        // do nothing right now
    }

    onBroadcastStitch(pl) {
        this.rejectCounter = 0;

        if (!this.gameState.stitch) {
            this.gameState.stitch = [];
            this.gameState.stitchPlayerPosition = [];
        }
        this.gameState.stitchPlayerPosition.push(this.gameState.lastPlayerPosition);
        this.gameState.stitch.push(pl.playedCards);
    }

    onBroadcastGameFinished(pl) {
        this.gameState = {};
        if (this.strategy.gameFinished) this.strategy.gameFinished(pl);
        if (this.debug) console.log('single game finished', pl);
    }

    onBroadcastWinnerTeam(pl) {
        if (this.debug) console.log('all games finished', pl);
        this.dispatcher.emit('closeConnection');
    }

    onBadMessage(pl) {
        if (this.debug) cconsole.error('bad message:', pl);
        if (this.strategy.notifyError) this.strategy.notifyError(pl);
    }
}

module.exports = GameStore;

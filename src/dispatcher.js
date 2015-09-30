'use strict';

class Dispatcher {
    constructor() {
        this.listeners = {};
    }

    emit(action, payload) {
        if (!this.listeners[action]) {
            console.error(`no listener attachted for action ${action}`);
            return;
        }
        this.listeners[action].forEach((listener) => {
            listener(payload);
        });
    }

    register(action, listener) {
        if (!this.listeners[action]) {
            this.listeners[action] = [];
        }
        this.listeners[action].push(listener);
    }
}

module.exports = Dispatcher;
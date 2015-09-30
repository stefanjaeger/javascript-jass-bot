'use strict';

let Bot = require('../index.js');

class MyStrategy {}

new Bot('A').withStrategy(MyStrategy).connect('localhost:3000');
'use strict';

var u = require('underscore'),
    MapConfig = require('../config/mapConfig');

var Direction = { /* TODO : DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

function Player(socket) {
    this.socket = socket;
    this.coords = {x: Math.random() * MapConfig.WIDTH, y: Math.random() * MapConfig.HEIGHT};
    this.directions = [];
    // Generate random user nickname
    this.nickname = 'user_' + Math.floor(Math.random() * 1000);
    
    var self = this;
    this.socket.on('commands', function(data) {
        self.onMessage(data); // TODO : rename onMessage
    });
}

Player.prototype.getUpdateMessage  = function() {
    return {coords: this.coords, nickname: this.nickname};
};

Player.prototype.update = function() {
    for(var i = 0; i < this.directions.length; i++) {
        switch (this.directions[i]) {
            case Direction.UP:
                this.coords.y = this.coords.y - 5;
                break;
            case Direction.DOWN:
                this.coords.y = this.coords.y + 5;
                break;
            case Direction.RIGHT:
                this.coords.x = this.coords.x + 5;
                break;
            case Direction.LEFT:
                this.coords.x = this.coords.x - 5;
                break;
        }
    }
    this.directions = [];
};

/* TODO : < 2 and not < 4 */
Player.prototype.isValidMessageData = function(data) {
    return (u.isArray(data.directions) && (data.directions.length < 4));
};

Player.prototype.onMessage = function(data) {
    /* FIXME RCH : is this really useful ? In a demo context, we could just not use additional calculations and trust messages */
//    if (!this.isValidMessageData(data)) { return; }
    this.directions = data.directions;
};

module.exports = Player;
'use strict';

var u = require('underscore'),
    PlayerConfig = require('../config/playerConfig'),
    MapConfig = require('../config/mapConfig');

var Direction = { /* FIXME TWI : DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

function Player(socket, game) {
    this.game = game;
    this.socket = socket;
    this.coords = {x: Math.random() * (MapConfig.WIDTH - PlayerConfig.WIDTH), y: Math.random() * (MapConfig.HEIGHT - PlayerConfig.HEIGHT)};
    this.directions = [];
    // Generate random user nickname
    this.nickname = 'user_' + Math.floor(Math.random() * 1000);
    
    var self = this;
    this.socket.on('commands', function(data) {
        self.onMessage(data);
    });
}

Player.prototype.equals  = function(player) {
    return (this.socket.id == player.socket.id);
};

Player.prototype.getUpdateMessage  = function() {
    return {coords: this.coords, nickname: this.nickname};
};

Player.prototype.collideWithMap = function() {
    return (this.coords.x < 0 ||
            this.coords.y < 0 ||
            this.coords.x + PlayerConfig.WIDTH > MapConfig.WIDTH ||
            this.coords.y + PlayerConfig.HEIGHT > MapConfig.HEIGHT);
};

/* FIXME TWI : implement */
Player.prototype.collideWithPlayer = function(player) {
    return false;
};

Player.prototype.update = function() {

    var saveCoords = {
        x: this.coords.x,
        y: this.coords.y
    };

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

    if (!this.game.canPlayerMove(this)) {
        this.coords = saveCoords;
    }
};

Player.prototype.isValidMessageData = function(data) {
    return (u.isArray(data.directions) && (data.directions.length < 4));
};

Player.prototype.onMessage = function(data) {
    /* FIXME RCH : is this really useful ? In a demo context, we could just not use additional calculations and trust messages */
//    if (!this.isValidMessageData(data)) { return; }
    this.directions = data.directions;
};

module.exports = Player;
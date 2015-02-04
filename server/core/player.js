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
    
    var self = this;
    this.socket.on('commands', function(data) {
        self.onMessage(data); // TODO : rename onMessage
    });
}

Player.prototype.getUpdateMessage  = function() {
    return {coords: this.coords};
};

Player.prototype.update = function() {
    
    for(var i = 0; i < this.directions.length; i++) {
        switch (this.directions[i]) {
            case Direction.UP:
                this.coords.y--;
                break;
            case Direction.DOWN:
                this.coords.y++;
                break;
            case Direction.RIGHT:
                this.coords.x++;
                break;
            case Direction.LEFT:
                this.coords.x--;
                break;
        }
    }
};

/* TODO : < 2 and not < 4 */
Player.prototype.isValidMessageData = function(data) {    
    return (u.isArray(data.directions) && (data.directions.length < 4));
};

Player.prototype.onMessage = function(data) {
    if (!this.isValidMessageData(data)) { return; }    
    this.directions = data.directions;
};

module.exports = Player;
'use strict';

var Player = require('./player'),
    PlayerConfig = require('../config/playerConfig'),
    MapConfig = require('../config/mapConfig'),
    u = require('underscore');

function Game(socket) {
    this.socket = socket;
    this.players = [];    
}

Game.prototype.addPlayer = function(socket) {
    console.log('Adding socket id : ' + socket.id);
    var isColliding = true, player = new Player(socket, this);
    while (isColliding) {
        player.coords = {x: parseInt(Math.random() * (MapConfig.WIDTH - PlayerConfig.WIDTH)), y: parseInt(Math.random() * (MapConfig.HEIGHT - PlayerConfig.HEIGHT))};
        player.coords.x = player.coords.x - (player.coords.x % PlayerConfig.SPEED);
        player.coords.y = player.coords.y - (player.coords.y % PlayerConfig.SPEED);

        isColliding = this.isPlayerCollidingWithAnOther(player);
    }
    this.players.push(player);
};

Game.prototype.removePlayer = function(socket) {
    var indexPlayerToRemove = this.players.indexOf(u.findWhere(this.players, {socket: socket}));
    if (indexPlayerToRemove > -1) {
        this.players.splice(indexPlayerToRemove, 1);
    }
};

Game.prototype.isPlayerCollidingWithAnOther = function(player) {
    for(var i = 0; i < this.players.length; i++) {
        if (!player.equals(this.players[i]) && player.collideWithPlayer(this.players[i])) {
            return true;
        }
    }
    return false;
};

Game.prototype.canPlayerMove = function(player) {
    return !player.collideTopOrLeftWithMap() && !this.isPlayerCollidingWithAnOther(player);
};

Game.prototype.extendMapIfPlayerColliding = function(player) {
    if (player.collideBottomWithMap()) {
        this.mapHeight += PlayerConfig.SPEED * 2;
    }
    if (player.collideRightWithMap()) {
        this.mapWidth += PlayerConfig.SPEED * 2;
    }
};

Game.prototype.update = function() {

    var updateMessage = {players: []};

    for (var i = 0; i < this.players.length; i++) {

        this.players[i].update();

        this.extendMapIfPlayerColliding(this.players[i]);

        if (this.players[i].explosionState > 15) {
            if (this.players[i].health <= 0) {
                this.removePlayer(this.players[i].socket);
                continue;
            } else {
                this.players[i].isExploding = false;
                this.players[i].explosionState = -1;
            }
        } else {
            // check bullet collision
            for (var j = 0; j < this.players.length; j++) {
                if (i != j) {
                    for (var k = 0; k < this.players[j].bullets.length; k++) {
                        if (this.players[i].collideWithBullet(this.players[j].bullets[k].coords)) {
                            this.players[j].bullets[k].isExploding = true;
                            this.players[i].isExploding = true;
                            break;
                        }
                    }
                }
            }
        }

        updateMessage.players.push(this.players[i].getUpdateMessage());
    }

    this.socket.emit('update', updateMessage);
};

module.exports = Game;
'use strict';

var Player = require('./player'),
    u = require('underscore');

function Game(socket) {
    this.socket = socket;
    this.players = [];    
}

Game.prototype.addPlayer = function(socket) {
    console.log('Adding socket id : ' + socket.id);
    this.players.push(new Player(socket, this));
};

Game.prototype.removePlayer = function(socket) {
    var indexPlayerToRemove = this.players.indexOf(u.findWhere(this.players, {socket: socket}));
    if (indexPlayerToRemove > -1) {
        this.players.splice(indexPlayerToRemove, 1);
    }
};

Game.prototype.canPlayerMove = function(player) {

    if (player.collideWithMap()) {
        return false;
    }

    for(var i = 0; i < this.players.length; i++) {
        if (!player.equals(this.players[i]) && player.collideWithPlayer(this.players[i])) {
            return false;
        }
    }

    return true;
};

Game.prototype.update = function() {

    var updateMessage = {players: []};

    for (var i = 0; i < this.players.length; i++) {

        this.players[i].update();

        if (this.players[i].explosionState > 15) {
            if (this.players[i].health <= 0) {
                this.removePlayer(this.players[i].socket);
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
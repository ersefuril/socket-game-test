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
    var playerToRemove = u.findWhere(this.players, {socket: socket});
    this.players.splice(this.players.indexOf(playerToRemove), 1);
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
        updateMessage.players.push(this.players[i].getUpdateMessage());
    }
    this.socket.emit('update', updateMessage);
};

module.exports = Game;
'use strict';

function Game(socket) {

    this.players = [];
    
    var self = this;
    socket.on('update', function(updateMessage) {
        self.update(updateMessage);
    });
}

Game.prototype.update = function(messageData) {
    this.players = messageData.players;
};

Game.prototype.draw = function(context) {
    
    for (var i = 0; i < this.players.length; i++) {
        PlayerDrawer.draw(context, this.players[i]);
    }
};
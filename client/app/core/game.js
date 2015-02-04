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
    
    var img = document.getElementById("jeep");
    
    for (var i = 0; i < this.players.length; i++) {
        context.drawImage(img,this.players[i].coords.x,this.players[i].coords.y,100,100);
    }
};
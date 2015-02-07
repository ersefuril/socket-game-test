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
        // Draw player's car
        context.drawImage(img,this.players[i].coords.x,this.players[i].coords.y,100,100);
        // Draw player's nickname
        context.fillStyle = 'rgb(74, 61, 25)';
        context.font = '8pt Lucida Console';
        context.fillText(this.players[i].nickname, this.players[i].coords.x + 50 ,this.players[i].coords.y + 15);
    }
};
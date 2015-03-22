'use strict';

function Game(socket, screenSize) {

    this.socket = socket;
    this.screenSize = screenSize;
    this.players = [];
    this.cameraCoords = {x: 0, y: 0};
    this.backgroundImage = document.getElementById("background");

    var self = this;
    this.socket.on('update', function(updateMessage) {
        self.update(updateMessage);
    });
}

Game.prototype.update = function(messageData) {
    this.players = messageData.players;
};

Game.prototype.setScreenSize = function(size) {
    this.screenSize = size;
};

Game.prototype.draw = function(context) {

    var currentPlayer = _.findWhere(this.players, {socketId: this.socket.id});

    if (currentPlayer) {
        this.cameraCoords.x = currentPlayer.coords.x - this.screenSize.width/2;
        this.cameraCoords.y = currentPlayer.coords.y - this.screenSize.height/2;
        if (this.cameraCoords.x < 0) {
            this.cameraCoords.x = 0;
        }
        if (this.cameraCoords.y < 0) {
            this.cameraCoords.y = 0;
        }
    }

    //draw background
    var x = 0, y = 0, sx = this.cameraCoords.x % 1024, sy = this.cameraCoords.y % 1024;//, h, w;
    while (x < this.screenSize.width) {

        context.drawImage(this.backgroundImage, sx, sy, 1024 - sx, 1024 - sy, x, y, 1024 - sx, 1024 - sy);

        y += 1024 - sy;

        while (y < this.screenSize.height) {
            context.drawImage(this.backgroundImage, sx, 0, 1024 - sx, 1024, x, y, 1024 - sx, 1024);
            y += 1024;
        }

        y = 0;
        sy = this.cameraCoords.y % 1024;
        x += 1024 - sx;
        sx = 0;
    }


    for (var i = 0; i < this.players.length; i++) {
        PlayerDrawer.draw(context, this.players[i], this.cameraCoords);
    }
};
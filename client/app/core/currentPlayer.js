'use strict';

var Direction = { /* TODO : client/server DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

function CurrentPlayer(socket) {
    this.socket = socket;
    this.commands = {directions: []};
}

CurrentPlayer.prototype.addDirection = function(direction) {
    this.commands.directions.push(direction);
    this.commandsChanged = true;
};

CurrentPlayer.prototype.removeDirection = function(direction) {
    this.commands.directions.splice(this.commands.directions.indexOf(direction), 1);
    this.commandsChanged = true;
};

CurrentPlayer.prototype.onKeyDown  = function(keyCode) {

    switch(keyCode) {
        case 38:
            this.addDirection(Direction.UP);
            break;
        case 40:
            this.addDirection(Direction.DOWN);
            break;
        case 39:
            this.addDirection(Direction.RIGHT);
            break;
        case 37:
            this.addDirection(Direction.LEFT);
            break;
    }
};

CurrentPlayer.prototype.onKeyUp  = function(keyCode) {

    switch(keyCode) {
        case 38:
            this.removeDirection(Direction.UP);
            break;
        case 40:
            this.removeDirection(Direction.DOWN);
            break;
        case 39:
            this.removeDirection(Direction.RIGHT);
            break;
        case 37:
            this.removeDirection(Direction.LEFT);
            break;
    }
};

CurrentPlayer.prototype.emitCommands  = function() {

    if (!this.commandsChanged) {return;}

    this.socket.emit('commands', this.commands);

    this.commandsChanged = false;
};
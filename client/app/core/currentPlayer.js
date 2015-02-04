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

/* TODO : Is having several directions is useful when we have only one keyCode ?! */

CurrentPlayer.prototype.onKeyDown  = function(keyCode) {
    switch(keyCode) {
        case 38:
            this.commands.directions.push(Direction.UP);
            break;
        case 40:
            this.commands.directions.push(Direction.DOWN);
            break;
        case 39:
            this.commands.directions.push(Direction.RIGHT);
            break;
        case 37:
            this.commands.directions.push(Direction.LEFT);
            break;
    }
};

CurrentPlayer.prototype.onKeyUp  = function(keyCode) {
    switch(keyCode) {
        case 38:
            this.commands.directions.splice(this.commands.directions.indexOf(Direction.UP), 1);
            break;
        case 40:
            this.commands.directions.splice(this.commands.directions.indexOf(Direction.DOWN), 1);
            break;
        case 39:
            this.commands.directions.splice(this.commands.directions.indexOf(Direction.RIGHT), 1);
            break;
        case 37:
            this.commands.directions.splice(this.commands.directions.indexOf(Direction.LEFT), 1);
            break;
    }
};

CurrentPlayer.prototype.emitCommands  = function() {

    if (!this.commands.directions.length) {return;}

    this.socket.emit('commands', this.commands);

    this.commands = {directions: []};
};
/* Fixme TWI : anonymize */

var socket = io('http://localhost:3000');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

var game = new Game(socket), currentPlayer = new CurrentPlayer(socket);

window.onkeyup = function(event) {
    currentPlayer.onKeyUp(event.keyCode);
};


window.onkeydown = function(event) {
    if (!event.repeat) {
        currentPlayer.onKeyDown(event.keyCode);
    }
};

setInterval(function() {
    
    // clear everything in the map
    context.clearRect(0,0,window.innerWidth,window.innerHeight);

    //draw game
    game.draw(context);
    
    currentPlayer.emitCommands();
}, 20);
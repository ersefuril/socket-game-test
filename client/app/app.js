var socket = io('http://localhost:3000');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

/* TODO : Listen window resize */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(canvas.style);

var game = new Game(socket), currentPlayer = new CurrentPlayer(socket);

window.onkeyup = function(event) {
    currentPlayer.onKeyUp(event.keyCode);
};

window.onkeydown = function(event) {
    currentPlayer.onKeyDown(event.keyCode);
};

setInterval(function() {
    
    //clear background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0,0,window.innerWidth,window.innerHeight);
    
    //draw game
    game.draw(context);
    
    currentPlayer.emitCommands();
}, 20);
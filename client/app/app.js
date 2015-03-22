/* Fixme TWI : anonymize */

var socket = io('http://localhost:3000', {forceNew: true});
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var game = new Game(socket, {width: window.innerWidth, height: window.innerHeight}), currentPlayer = new CurrentPlayer(socket);

window.onkeyup = function(event) {
    currentPlayer.onKeyUp(event.keyCode);
};

window.onkeydown = function(event) {
    if (!event.repeat) {
        currentPlayer.onKeyDown(event.keyCode);
    }
};

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.setScreenSize({width: window.innerWidth, height: window.innerHeight});
    draw();
}

function draw() {

    // clear everything in the map
    context.clearRect(0,0,window.innerWidth,window.innerHeight);

    //draw game
    game.draw(context);
}

setInterval(function() {
    draw();
    currentPlayer.emitCommands();
}, 20);
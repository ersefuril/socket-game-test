var express = require('express');
var app = express();
var server = require('http').createServer(app);
var gameSocket = require('socket.io')(server);

var Game = require('./core/game');

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var game = new Game(gameSocket);

gameSocket.on('connection', function(playerSocket) {

    game.addPlayer(playerSocket);

    playerSocket.on('disconnect', function () {
        game.removePlayer(playerSocket);
    });
});

setInterval(function(){
    game.update();
}, 20);


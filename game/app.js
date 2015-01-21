/**
     This code has been extracted from https://github.com/underscorediscovery/realtime-multiplayer-in-html5

     Copyright (c) 2012 Sven "FuzzYspo0N" Bergström

     written by : http://underscorediscovery.com
     written for : http://buildnewgames.com/real-time-multiplayer/

     MIT Licensed.
 */
var express     = require('express');
var UUID        = require('node-uuid');
var app         = express();
var server      = require('http').createServer(app);
var io          = require('socket.io')(server);

var port = process.env.PORT || 3001;
app.use(express.static('game'));


server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// By default, redirect to index.html
app.get( '/', function( req, res ){
    console.log('trying to load %s', __dirname + 'client/index.html');
    res.sendFile('client/index.html' , { root:__dirname });
});


//Enter the game server code. The game server handles
//client connections looking for a game, creating games,
//leaving games, joining games and ending games when they leave.
game_server = require('./server/game.server.js');

//Socket.io will call this function when a client connects,
//So we can send that client looking for a game to play,
//as well as give that client a unique ID to use so we can
//maintain the list if players.
io.sockets.on('connection', function (client) {

    //Generate a new UUID, looks something like
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();

    //tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.userid } );

    //now we can find them a game to play with someone.
    //if no game exists with someone waiting, they create one and wait.
    game_server.findGame(client);

    //Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.userid + ' connected');


    //Now we want to handle some of the messages that clients will send.
    //They send messages here, and we send them to the game_server to handle.
    client.on('message', function(m) {

        game_server.onMessage(client, m);

    }); //client.on message

    //When this client disconnects, we want to tell the game server
    //about that as well, so it can remove them from the game they are
    //in, and make sure the other player knows that they left and so on.
    client.on('disconnect', function () {

        //Useful to know when soomeone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);

        //If the client was in a game, set by game_server.findGame,
        //we can tell the game server to update that game state.
        if(client.game && client.game.id) {

            //player leaving a game should destroy that game
            game_server.endGame(client.game.id, client.userid);

        } //client.game_id

    }); //client.on disconnect

}); //io.sockets.on connection
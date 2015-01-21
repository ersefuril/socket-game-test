/**
 This code has been extracted from https://github.com/underscorediscovery/realtime-multiplayer-in-html5

 Copyright (c) 2012 Sven "FuzzYspo0N" Bergström

 written by : http://underscorediscovery.com
 written for : http://buildnewgames.com/real-time-multiplayer/

 MIT Licensed.
 */
var game = {};

window.onload = function() {

    // Create a new game core
    game = new game_core();

    //Fetch the viewport
    game.viewport = document.getElementById('viewport');

    //Adjust their size
    game.viewport.width = game.world.width;
    game.viewport.height = game.world.height;

    //Fetch the rendering contexts
    game.ctx = game.viewport.getContext('2d');

    //Finally, start the loop
    game.update( new Date().getTime() );


};
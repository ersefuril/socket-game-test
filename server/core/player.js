'use strict';

var u = require('underscore'),
    PlayerConfig = require('../config/playerConfig'),
    BulletConfig = require('../config/bulletConfig'),
    Bullet = require('./bullet');

var Direction = { /* FIXME TWI : DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

function Player(socket, game) {
    this.game = game;
    this.socket = socket;
    this.directions = [];
    this.orientations = [];
    this.bullets = [];
    this.explosionState = -1;
    this.isExploding = false;
    this.health = 100;
    // Generate random user nickname
    this.nickname = 'user_' + Math.floor(Math.random() * 1000);
    
    var self = this;
    this.socket.on('commands', function(data) {
        self.onMessage(data);
    });
}

Player.prototype.equals  = function(player) {
    return (this.socket.id == player.socket.id);
};

/* FIXME TWI : send nickname only the first time */
Player.prototype.getUpdateMessage  = function() {
    var bulletsUpdateMessage = this.bullets.map(function(b) {return b.getUpdateMessage()});
    return {coords: this.coords, nickname: this.nickname, socketId: this.socket.id, directions: this.orientations, bullets: bulletsUpdateMessage, health: this.health};
};

Player.prototype.collideBottomWithMap = function() {
    return (this.coords.y + PlayerConfig.HEIGHT > this.game.mapHeight);
};

Player.prototype.collideRightWithMap = function() {
    return (this.coords.x + PlayerConfig.WIDTH > this.game.mapWidth);
};

Player.prototype.collideTopOrLeftWithMap = function() {
    return (this.coords.y < 0 || this.coords.x < 0);
};

Player.prototype.collideWithBullet = function(bulletCoords) {
    return ( // TODO TWI : Rectangle class with collide function
        this.coords.x < (bulletCoords.x + BulletConfig.WIDTH)
        && (this.coords.x + PlayerConfig.WIDTH) > bulletCoords.x
        && this.coords.y < (bulletCoords.y + BulletConfig.HEIGHT)
        && (this.coords.y + PlayerConfig.HEIGHT) > bulletCoords.y
    );
};

Player.prototype.collideWithPlayer = function(player) {
    return ( // TODO TWI : Rectangle class with collide function
        this.coords.x < (player.coords.x + PlayerConfig.WIDTH)
        && (this.coords.x + PlayerConfig.WIDTH) > player.coords.x
        && this.coords.y < (player.coords.y + PlayerConfig.HEIGHT)
        && (this.coords.y + PlayerConfig.HEIGHT) > player.coords.y
    );
};

Player.prototype.update = function() {

    // Update bullets and remove bullets out of map
    for (i = 0; i < this.bullets.length; i++) {
        this.bullets[i].update();
        if (this.bullets[i].isOutOfMap() || (this.bullets[i].explosionState > 15)) {
            this.bullets.splice(i, 1);
        }
    }

    if (this.isExploding) {
        this.explosionState++;
        this.health--;
        return;
    }

    var saveCoords = {
        x: this.coords.x,
        y: this.coords.y
    };

    /* FIXME TWI : calcul speed when diagonal */
    var speed = (this.directions.length == 2) ? PlayerConfig.DIAGONAL_SPEED : PlayerConfig.SPEED;

    for(var i = 0; i < this.directions.length; i++) {
        switch (this.directions[i]) {
            case Direction.UP:
                this.coords.y = this.coords.y - speed;
                break;
            case Direction.DOWN:
                this.coords.y = this.coords.y + speed;
                break;
            case Direction.RIGHT:
                this.coords.x = this.coords.x + speed;
                break;
            case Direction.LEFT:
                this.coords.x = this.coords.x - speed;
                break;
        }
    }

    if (!this.game.canPlayerMove(this)) {
        this.coords = saveCoords;
    }
};

Player.prototype.isValidMessageData = function(data) {
    return (u.isArray(data.directions) && (data.directions.length < 4));
};

Player.prototype.onMessage = function(data) {
    /* FIXME RCH : is this really useful ? In a demo context, we could just not use additional calculations and trust messages */
//    if (!this.isValidMessageData(data)) { return; }

    this.directions = data.directions;

    if (data.directions.length) {
        this.orientations = data.directions;
    }

    if (data.throwBullet) {
        this.bullets.push(new Bullet(u.clone(this.coords), this.orientations, this.game))
    }
};

module.exports = Player;
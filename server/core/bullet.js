'use strict';

var u = require('underscore'),
    BulletConfig = require('../config/bulletConfig'),
    PlayerConfig = require('../config/playerConfig');

var Direction = { /* FIXME TWI : DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

function Bullet(playerCoords, directions, game) {
    this.game = game;
    this.coords = {
        x: playerCoords.x + PlayerConfig.WIDTH/2,
        y: playerCoords.y + PlayerConfig.HEIGHT/2
    };
    this.directions = directions;
    this.explosionState = -1;
    this.isExploding = false;
}

Bullet.prototype.isOutOfMap = function() {
    return (this.coords.x + BulletConfig.WIDTH < 0 ||
    this.coords.y + BulletConfig.HEIGHT < 0 ||
    this.coords.x > this.game.mapWidth ||
    this.coords.y > this.game.mapHeight);
};

Bullet.prototype.getUpdateMessage = function() {
    return {
        directions: this.directions,
        coords: this.coords,
        explosionState: this.explosionState
    };
};

Bullet.prototype.update = function() {

    if (this.isExploding) {
        this.explosionState++;
        return;
    }

    /* FIXME TWI : calcul speed when diagonal */
    var speed = (this.directions.length == 2) ? BulletConfig.DIAGONAL_SPEED : BulletConfig.SPEED;

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
};

module.exports = Bullet;
'use strict';

var Direction = { /* TODO : client/server DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

var BulletDrawer = {
    images: {
        UP: document.getElementById("bullet0"),
        UP_RIGHT: document.getElementById("bullet4"),
        RIGHT: document.getElementById("bullet8"),
        DOWN_RIGHT: document.getElementById("bullet12"),
        DOWN: document.getElementById("bullet16"),
        DOWN_LEFT: document.getElementById("bullet20"),
        LEFT: document.getElementById("bullet24"),
        UP_LEFT: document.getElementById("bullet28")
    },
    getExplosionImage: function(imgNumber) {
        return document.getElementById("explosion" + imgNumber);
    },
    nbExplosionImages: 15
};

BulletDrawer.getImageByDirections = function(directions) {

    if (directions.length == 2) {

        if (directions.indexOf(Direction.UP) > -1 && directions.indexOf(Direction.RIGHT) > -1)
            return BulletDrawer.images.UP_RIGHT;

        if (directions.indexOf(Direction.DOWN) > -1 && directions.indexOf(Direction.RIGHT) > -1)
            return BulletDrawer.images.DOWN_RIGHT;

        if (directions.indexOf(Direction.DOWN) > -1 && directions.indexOf(Direction.LEFT) > -1)
            return BulletDrawer.images.DOWN_LEFT;

        if (directions.indexOf(Direction.UP) && directions.indexOf(Direction.LEFT) > -1)
            return BulletDrawer.images.UP_LEFT;
    }

    if (directions.length) {

        switch (directions[0]) {
            case Direction.UP:
                return BulletDrawer.images.UP;
            case Direction.DOWN:
                return BulletDrawer.images.DOWN;
            case Direction.RIGHT:
                return BulletDrawer.images.RIGHT;
            case Direction.LEFT:
                return BulletDrawer.images.LEFT;
        }
    }

    return BulletDrawer.images.UP;
};

BulletDrawer.draw = function(context, bullet, cameraCoords) {
    context.drawImage(BulletDrawer.getImageByDirections(bullet.directions), bullet.coords.x - 16 - cameraCoords.x, bullet.coords.y - 16 - cameraCoords.y, 32, 32);
    if (bullet.explosionState > -1) {
        context.drawImage(BulletDrawer.getExplosionImage(bullet.explosionState), bullet.coords.x - 16 - cameraCoords.x, bullet.coords.y - 16 - cameraCoords.y, 32, 32);
    }
};
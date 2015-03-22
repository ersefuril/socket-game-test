'use strict';

var Direction = { /* TODO : client/server DTO */
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};

var PlayerDrawer = {
    images: {
        UP: document.getElementById("jeep8"),
        UP_RIGHT: document.getElementById("jeep12"),
        RIGHT: document.getElementById("jeep16"),
        DOWN_RIGHT: document.getElementById("jeep20"),
        DOWN: document.getElementById("jeep24"),
        DOWN_LEFT: document.getElementById("jeep28"),
        LEFT: document.getElementById("jeep0"),
        UP_LEFT: document.getElementById("jeep4")
    }
};

PlayerDrawer.getImageByDirections = function(directions) {

    if (directions.length == 2) {

        if (directions.indexOf(Direction.UP) > -1 && directions.indexOf(Direction.RIGHT) > -1)
            return PlayerDrawer.images.UP_RIGHT;

        if (directions.indexOf(Direction.DOWN) > -1 && directions.indexOf(Direction.RIGHT) > -1)
            return PlayerDrawer.images.DOWN_RIGHT;

        if (directions.indexOf(Direction.DOWN) > -1 && directions.indexOf(Direction.LEFT) > -1)
            return PlayerDrawer.images.DOWN_LEFT;

        if (directions.indexOf(Direction.UP) > -1 && directions.indexOf(Direction.LEFT) > -1)
            return PlayerDrawer.images.UP_LEFT;
    }

    if (directions.length) {

        switch (directions[0]) {
            case Direction.UP:
                return PlayerDrawer.images.UP;
            case Direction.DOWN:
                return PlayerDrawer.images.DOWN;
            case Direction.RIGHT:
                return PlayerDrawer.images.RIGHT;
            case Direction.LEFT:
                return PlayerDrawer.images.LEFT;
        }
    }

    return PlayerDrawer.images.UP;
};

PlayerDrawer.draw = function(context, player, cameraCoords) {

    // Draw player's car
    context.drawImage(PlayerDrawer.getImageByDirections(player.directions), player.coords.x - cameraCoords.x, player.coords.y - cameraCoords.y, 128, 128);
    // Draw player's nickname
    context.fillStyle = 'rgb(74, 61, 25)';
    context.font = '8pt Lucida Console';
    context.fillText(player.nickname, player.coords.x + 50 - cameraCoords.x, player.coords.y + 15 - cameraCoords.y);
    // Draw health bar
    context.fillStyle="#FFFFFF";
    context.fillRect(player.coords.x + 50 - cameraCoords.x, player.coords.y - cameraCoords.y, (player.health/100)*30, 5);

    // Drawing bullets
    for (var i = 0; i < player.bullets.length; i++) {
        BulletDrawer.draw(context, player.bullets[i], cameraCoords);
    }
};
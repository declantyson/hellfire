/*
 *
 *	XL Platform Fighter/Stages
 *	XL Gaming/Declan Tyson
 *	v0.0.3
 *	10/09/2016
 *
 */

class Stage {
    constructor(game, name, floors, gravity) {
        this.game = game;
        this.name = name;
        this.floors = floors;
        this.gravity = gravity / this.game.fps;
    }
}

class Floor {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
    }
}
/*
 *
 *	XL Platform Fighter/Stages
 *	XL Gaming/Declan Tyson
 *	v0.0.1
 *	07/09/2016
 *
 */

class Stage {
    constructor(game, name, floors) {
        this.game = game;
        this.name = name;
        this.floors = floors;
    }
}

class Floor {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Stages
 *	XL Gaming/Declan Tyson
 *	v0.0.2
 *	07/09/2016
 *
 */

var Stage = function Stage(game, name, floors, gravity) {
    _classCallCheck(this, Stage);

    this.game = game;
    this.name = name;
    this.floors = floors;
    this.gravity = gravity / this.game.fps;
};

var Floor = function Floor(startX, startY, endX, endY) {
    _classCallCheck(this, Floor);

    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
};
//# sourceMappingURL=stages.js.map

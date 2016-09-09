"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.1
 *	07/09/2016
 *
 */

var Character = function () {
    function Character(game, name, maxSpeed, acceleration, deceleration, currentDir, hurtboxes, turnDelay, actions) {
        _classCallCheck(this, Character);

        this.game = game;
        this.name = name;
        this.maxSpeed = maxSpeed / this.game.fps;
        this.acceleration = acceleration;
        this.deceleration = deceleration;
        this.currentSpeed = 0;
        this.currentDir = currentDir;
        this.hurtboxes = hurtboxes;
        this.turnDelay = turnDelay;
    }

    _createClass(Character, [{
        key: "move",
        value: function move() {
            var acceleration = this.maxSpeed / (this.acceleration * this.game.fps);
            if (this.currentSpeed < this.maxSpeed) {
                this.currentSpeed += acceleration;
            }

            for (var i = 0; i < this.hurtboxes.length; i++) {
                this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            var deceleration = this.maxSpeed / (this.deceleration * this.game.fps);
            if (this.currentSpeed > 0) {
                this.currentSpeed -= deceleration;
                if (this.currentSpeed < 0) this.currentSpeed = 0;
            }

            for (var i = 0; i < this.hurtboxes.length; i++) {
                this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
            }
        }
    }, {
        key: "turn",
        value: function turn() {
            this.currentSpeed = this.maxSpeed / (this.turnDelay * this.game.fps);
        }
    }]);

    return Character;
}();

var Hurtbox = function Hurtbox(x, y, width, height) {
    _classCallCheck(this, Hurtbox);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};
//# sourceMappingURL=characters.js.map

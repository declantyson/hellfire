"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.26
 *	10/09/2016
 *
 */

var Character = function () {
    function Character(game, startPosY, startPosX) {
        _classCallCheck(this, Character);

        this.game = game;
    }

    _createClass(Character, [{
        key: "initialise",
        value: function initialise(opts) {
            // attributes
            this.name = opts.name;
            this.maxSpeed = opts.maxSpeed / this.game.fps;
            this.acceleration = opts.acceleration;
            this.deceleration = opts.deceleration;
            this.turnDelay = opts.turnDelay;
            this.hurtboxes = opts.hurtboxes;
            this.weight = 1 / opts.weight;
            this.airSpeed = opts.airSpeed / this.game.fps;
            this.jumpPower = 1 / opts.jumpPower;
            this.jumpHeight = opts.jumpHeight;
            this.allowedJumps = opts.allowedJumps;
            this.jumpThreshold = opts.jumpThreshold;

            // state
            this.currentSpeed = 0;
            this.currentFallSpeed = 0;
            this.currentDir = opts.currentDir;
            this.currentVerticalDir = 1;
            this.jumpStart = this.hurtboxes[0].y;
            this.jumpsRemaining = opts.allowedJumps;
            this.jumpHeld = false;
        }
    }, {
        key: "drawActions",
        value: function drawActions(stage) {

            this.fall(stage.gravity, stage.floors);

            if (this.game.currentKeys[this.game.keyBindings.right]) {
                if (this.game.keyChanged && this.currentDir !== 1) {
                    this.turn(1);
                }
                this.move();
            } else if (this.game.currentKeys[this.game.keyBindings.left]) {
                if (this.game.keyChanged && this.currentDir !== -1) {
                    this.turn(-1);
                }
                this.move();
            } else {
                this.stop();
            }

            if (this.game.currentKeys[this.game.keyBindings.jump]) {
                if (this.jumpHeld) return;
                this.jumpHeld = true;
                if (this.jumpsRemaining > 0) {
                    if (this.currentVerticalDir === -1 && this.jumpsRemaining < this.allowedJumps && this.hurtboxes[0].y > this.jumpStart - this.jumpThreshold.up || this.currentVerticalDir === 1 && this.jumpsRemaining < this.allowedJumps && this.hurtboxes[0].y > this.jumpStart - this.jumpThreshold.down) {
                        return;
                    }
                    this.jumpStart = this.hurtboxes[0].y;
                    this.currentVerticalDir = -1;
                    this.jumpsRemaining--;
                }
            } else {
                this.jumpHeld = false;
            }
        }
    }, {
        key: "move",
        value: function move() {
            var maxMovementSpeed = this.maxSpeed;
            if (this.currentFallSpeed > 0) maxMovementSpeed = this.airSpeed;

            var acceleration = maxMovementSpeed / (this.acceleration * this.game.fps);
            if (this.currentSpeed < maxMovementSpeed) {
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
            if (this.currentFallSpeed > 0) {
                deceleration = deceleration / 3;
            }

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
        value: function turn(dir) {
            if (this.currentSpeed === 0) return;

            var deceleration = this.maxSpeed / (this.turnDelay * this.game.fps);
            if (this.currentSpeed > 0) {
                this.currentSpeed -= deceleration;
                if (this.currentSpeed < 0) this.currentSpeed = 0;
            }

            if (this.currentSpeed === 0) {
                this.currentDir = dir;
                this.game.keyChanged = false;
            }
        }
    }, {
        key: "fall",
        value: function fall(gravity, floors) {
            if (this.currentVerticalDir === -1) {
                this.jump(gravity, floors);
                return;
            }

            var hitFloor = false;

            for (var h = 0; h < this.hurtboxes.length; h++) {
                var hurtbox = this.hurtboxes[h];
                for (var f = 0; f < floors.length; f++) {
                    var floor = floors[f];
                    if (hurtbox.y >= floor.y && (hurtbox.x >= floor.x && hurtbox.x <= floor.x + floor.width || hurtbox.x + hurtbox.width >= floor.x && hurtbox.x + hurtbox.width <= floor.x + floor.width)) {
                        hitFloor = true;
                        this.hurtboxes[0].y = floor.y;
                    }
                }
                if (hitFloor) {
                    this.jumpsRemaining = this.allowedJumps;
                    this.currentFallSpeed = 0;
                    break;
                } else if (this.jumpsRemaining === this.allowedJumps) {
                    this.jumpsRemaining = this.allowedJumps - 1;
                }

                this.currentFallSpeed += gravity / (this.weight * this.game.fps);
                hurtbox.y += this.currentFallSpeed;
            }
        }
    }, {
        key: "jump",
        value: function jump(gravity, floors) {
            if (this.hurtboxes[0].y > this.jumpStart - this.jumpHeight) {
                this.currentFallSpeed -= gravity / (this.jumpPower * this.game.fps);
                this.hurtboxes[0].y += this.currentFallSpeed;
            } else {
                this.currentVerticalDir = 1;
            }
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

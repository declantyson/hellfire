"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.113
 *	23/09/2016
 *
 */

var Character = function () {
    function Character(game, startPosX, startPosY) {
        _classCallCheck(this, Character);

        this.game = game;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.stocks = this.game.startingStockCount;
    }

    _createClass(Character, [{
        key: "initialise",
        value: function initialise(opts) {
            // attributes
            this.id = opts.id;
            this.name = opts.name;
            this.maxSpeed = opts.maxSpeed / this.game.fps;
            this.acceleration = opts.acceleration;
            this.deceleration = opts.deceleration;
            this.turnDelay = opts.turnDelay;
            this.hurtboxes = opts.hurtboxes;
            this.hitboxes = opts.hitboxes;
            this.weight = 1 / opts.weight;
            this.airSpeed = opts.airSpeed / this.game.fps;
            this.jumpPower = 1 / opts.jumpPower;
            this.jumpHeight = opts.jumpHeight;
            this.allowedJumps = opts.allowedJumps;
            this.jumpThreshold = opts.jumpThreshold;

            // state
            this.keysHeld = {};
            this.currentSpeed = 0;
            this.currentFallSpeed = 0;
            this.currentDir = opts.currentDir;
            this.currentVerticalDir = 1;
            this.jumpStart = this.hurtboxes[0].y;
            this.jumpsRemaining = opts.allowedJumps;
            this.jumping = false;
            this.stun = false;
            this.attacking = false;
            this.invulnerable = false;
            this.visibleHitboxes = [];

            this.damage = 0;
        }
    }, {
        key: "drawActions",
        value: function drawActions(stage) {
            this.fall(stage.gravity, stage.floors);
            this.visibleHitboxes = [];

            if (this.game.currentKeys[this.keyBindings.basicAttack] && !this.stun) {
                if (!this.attacking) this.attacking = true;
                for (var i = 0; i < this.hitboxes.basicAttack.length; i++) {
                    this.visibleHitboxes.push(this.hitboxes.basicAttack[i]);
                }
            } else {
                for (var i = 0; i < this.hitboxes.basicAttack.length; i++) {
                    if (this.hitboxes.basicAttack[i].currentFrame > this.hitboxes.basicAttack[i].endFrame + this.hitboxes.basicAttack[i].cooldown) {
                        this.hitboxes.basicAttack[i].currentFrame = 0;
                        this.attacking = false;
                    }
                    if (this.attacking) {
                        this.visibleHitboxes.push(this.hitboxes.basicAttack[i]);
                    }
                }
                this.keysHeld[this.keyBindings.basicAttack] = false;
            }

            if (this.stun) {
                this.hitstun();
            } else if (this.game.currentKeys[this.keyBindings.right]) {
                if (this.game.keyChanged && this.currentDir !== 1) {
                    this.turn(1);
                }
                this.move();
            } else if (this.game.currentKeys[this.keyBindings.left]) {
                if (this.game.keyChanged && this.currentDir !== -1) {
                    this.turn(-1);
                }
                this.move();
            } else {
                this.stop();
            }

            if (this.game.currentKeys[this.keyBindings.jump] && !this.stun) {
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

            if (!this.invulnerable) {
                for (var hurt = 0; hurt < this.hurtboxes.length; hurt++) {
                    var hurtbox = this.hurtboxes[hurt];
                    for (var c = 0; c < this.game.players.length; c++) {
                        var character = this.game.players[c].character;
                        if (this === character) continue;
                        for (var hit = 0; hit < character.visibleHitboxes.length; hit++) {
                            var hitbox = character.visibleHitboxes[hit];
                            if (hitbox.active && hurtbox.x < hitbox.calculatedX + hitbox.width && hurtbox.x + hurtbox.width > hitbox.calculatedX && hurtbox.y - hurtbox.height < character.hurtboxes[0].y - hitbox.yOffset && hurtbox.y > character.hurtboxes[0].y - hitbox.yOffset - hitbox.height) {
                                this.jumpStart = this.hurtboxes[0].y;
                                this.getHit(hitbox);
                                break;
                            }
                        }
                    }
                }
            }

            if (this.hurtboxes[0].x < 0 || this.hurtboxes[0].y < 0 || this.hurtboxes[0].x > this.game.canvas.width || this.hurtboxes[0].y > this.game.canvas.height) {
                this.loseStock();
            }
        }
    }, {
        key: "loseStock",
        value: function loseStock() {
            this.stocks--;
            this.damage = 0;
            if (this.stocks <= 0) {
                this.game.gameOver();
            } else {
                this.hurtboxes[0].x = this.startPosX;
                this.hurtboxes[0].y = this.startPosY;
                this.currentSpeed = 0;
            }
        }
    }, {
        key: "getHit",
        value: function getHit(hitbox) {
            var angleToSpeedModifier = hitbox.angle / 45;

            this.currentVerticalDir = -1;
            this.currentFallSpeed = this.currentVerticalDir * angleToSpeedModifier * hitbox.knockback * (1 + this.damage / 100);

            this.damage += hitbox.damage;
            console.log(this.damage, hitbox.damage);

            this.currentDir = hitbox.dir;
            this.currentSpeed = 1 / angleToSpeedModifier * hitbox.knockback;

            //this.stun = true;
            this.invulnerable = true;

            var character = this;
            setTimeout(function () {
                character.invulnerable = false;
            }, 100);

            setTimeout(function () {
                character.stun = false;
            }, hitbox.hitstun);
        }
    }, {
        key: "hitstun",
        value: function hitstun() {
            //this.stop()
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

            if (this.currentFallSpeed > 0) {
                this.jumping = false;
            }

            var hitFloor = false;

            for (var h = 0; h < this.hurtboxes.length; h++) {
                var hurtbox = this.hurtboxes[h];

                for (var f = 0; f < floors.length; f++) {
                    var floor = floors[f];
                    if (!this.jumping && hurtbox.y >= floor.y && this.currentVerticalDir === 1 && hurtbox.y - hurtbox.height <= floor.y && (hurtbox.x >= floor.x && hurtbox.x <= floor.x + floor.width || hurtbox.x + hurtbox.width >= floor.x && hurtbox.x + hurtbox.width <= floor.x + floor.width)) {
                        hitFloor = true;
                        if (this.stun) {
                            this.stun = false;
                            this.currentSpeed = this.currentDir;
                        }
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
                this.jumping = true;
            } else if (!this.stun) {
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

var Hitbox = function Hitbox(opts) {
    _classCallCheck(this, Hitbox);

    this.xOffset = opts.xOffset;
    this.yOffset = opts.yOffset;
    this.width = opts.width;
    this.height = opts.height;
    this.damage = opts.damage;
    this.angle = opts.angle;
    this.knockback = opts.knockback;
    this.growth = opts.growth;
    this.startFrame = opts.startFrame;
    this.endFrame = opts.endFrame;
    this.cooldown = opts.cooldown;

    this.name = opts.name;

    this.dir = 1;
    this.currentFrame = 0;
    this.active = false;
    var hitstunFrames = opts.hitstun || 60;
    this.hitstun = hitstunFrames / 60 * 1000;
};
//# sourceMappingURL=characters.js.map

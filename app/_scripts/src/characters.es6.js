/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.105
 *	16/09/2016
 *
 */

class Character {
    constructor(game, startPosX, startPosY) {
        this.game = game;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.stocks = this.game.startingStockCount;
    }

    initialise(opts) {
        // attributes
        this.id = opts.id;
        this.name = opts.name;
        this.maxSpeed = opts.maxSpeed / this.game.fps;
        this.acceleration = opts.acceleration;
        this.deceleration = opts.deceleration;
        this.turnDelay = opts.turnDelay;
        this.hurtboxes = opts.hurtboxes;
        this.hitboxes = opts.hitboxes;
        this.weight = 1/opts.weight;
        this.airSpeed = opts.airSpeed / this.game.fps;
        this.jumpPower = 1/opts.jumpPower;
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
        this.invulnerable = false;
        this.visibleHitboxes = [];
    }
    
    drawActions(stage) {
        this.fall(stage.gravity, stage.floors);

        if(this.game.currentKeys[this.keyBindings.basicAttack] && !this.stun) {
            if(this.keysHeld[this.keyBindings.basicAttack] === false) {
                this.keysHeld[this.keyBindings.basicAttack] = true;
                if(this.hitboxes.basicAttack[0].currentFrame > this.hitboxes.basicAttack[0].endFrame + this.hitboxes.basicAttack[0].cooldown) {
                    this.hitboxes.basicAttack[0].currentFrame = 0;
                }
            }
            if(this.hitboxes.basicAttack[0].currentFrame > this.hitboxes.basicAttack[0].endFrame + this.hitboxes.basicAttack[0].cooldown) {
                if(this.keysHeld[this.keyBindings.basicAttack] === false) this.hitboxes.basicAttack[0].currentFrame = 0;
            } else {
                this.visibleHitboxes = this.hitboxes.basicAttack;
            }
        } else {
            this.keysHeld[this.keyBindings.basicAttack] = false;
        }

        if(this.stun) {
            this.hitstun();
        } else if(this.game.currentKeys[this.keyBindings.right]) {
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
            if(this.jumpHeld) return;
            this.jumpHeld = true;
            if (this.jumpsRemaining > 0) {
                if (
                    (this.currentVerticalDir === -1 &&
                    this.jumpsRemaining < this.allowedJumps &&
                    this.hurtboxes[0].y > this.jumpStart - this.jumpThreshold.up)
                        ||
                    (this.currentVerticalDir === 1 &&
                    this.jumpsRemaining < this.allowedJumps &&
                    this.hurtboxes[0].y > this.jumpStart - this.jumpThreshold.down)
                ) {
                    return;
                }
                this.jumpStart = this.hurtboxes[0].y;
                this.currentVerticalDir = -1;
                this.jumpsRemaining--;
            }
        } else {
            this.jumpHeld = false;
        }

        if(!this.invulnerable) {
            for (var hurt = 0; hurt < this.hurtboxes.length; hurt++) {
                var hurtbox = this.hurtboxes[hurt];
                for (var c = 0; c < this.game.players.length; c++) {
                    var character = this.game.players[c].character;
                    if (this === character) continue;
                    for (var hit = 0; hit < character.visibleHitboxes.length; hit++) {
                        var hitbox = character.visibleHitboxes[hit];
                        if (
                            hitbox.active &&
                            (hurtbox.x < hitbox.calculatedX + hitbox.width &&
                            hurtbox.x + hurtbox.width > hitbox.calculatedX) &&
                            (hurtbox.y - hurtbox.height < character.hurtboxes[0].y - hitbox.yOffset &&
                            hurtbox.y > character.hurtboxes[0].y - hitbox.yOffset - hitbox.height)
                        ) {
                            this.getHit(hitbox);
                            break;
                        }
                    }
                }
            }
        }

        if(this.hurtboxes[0].x < 0 || this.hurtboxes[0].y < 0 || this.hurtboxes[0].x > this.game.canvas.width || this.hurtboxes[0].y > this.game.canvas.height) {
            this.loseStock();
        }
    }

    loseStock() {
        this.stocks--;
        if(this.stocks <= 0) {
            this.game.gameOver();
        } else {
            this.hurtboxes[0].x = this.startPosX;
            this.hurtboxes[0].y = this.startPosY;
            this.currentSpeed = 0;
        }
    }

    getHit(hitbox) {
        var angleToSpeedModifier = hitbox.angle / 45;

        this.currentVerticalDir = -1;
        this.currentFallSpeed = this.currentVerticalDir * angleToSpeedModifier * hitbox.knockback;

        this.currentDir = (this.currentDir * hitbox.dir);
        this.currentSpeed = (1 / angleToSpeedModifier) * hitbox.knockback;

        //this.stun = true;
        this.invulnerable = true;

        var character = this;
        setTimeout(function () {
            character.invulnerable = false;
        }, 100);

        setTimeout(function() {
            character.stun = false;
        }, hitbox.hitstun);
    }

    hitstun() {
        //this.stop()
    }

    move() {
        var maxMovementSpeed = this.maxSpeed;
        if(this.currentFallSpeed > 0) maxMovementSpeed = this.airSpeed;

        var acceleration = maxMovementSpeed / (this.acceleration * this.game.fps);
        if(this.currentSpeed < maxMovementSpeed) {
            this.currentSpeed += acceleration;
        }

        for(let i = 0; i < this.hurtboxes.length; i++) {
            this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
        }
    }

    stop() {
        var deceleration = this.maxSpeed / (this.deceleration * this.game.fps);
        if(this.currentFallSpeed > 0) {
            deceleration = deceleration / 3;
        }

        if(this.currentSpeed > 0) {
            this.currentSpeed -= deceleration;
            if(this.currentSpeed < 0) this.currentSpeed = 0;
        }

        for(let i = 0; i < this.hurtboxes.length; i++) {
            this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
        }
    }

    turn(dir) {
        if(this.currentSpeed === 0) return;

        let deceleration = this.maxSpeed / (this.turnDelay * this.game.fps);
        if(this.currentSpeed > 0) {
            this.currentSpeed -= deceleration;
            if(this.currentSpeed < 0) this.currentSpeed = 0;
        }

        if(this.currentSpeed === 0) {
            this.currentDir = dir;
            this.game.keyChanged = false;
        }
    }

    fall(gravity, floors) {
        if(this.currentVerticalDir === -1) {
            this.jump(gravity, floors);
            return;
        }

        if(this.currentFallSpeed > 0) {
            this.jumping = false;
        }

        var hitFloor = false;

        for(let h = 0; h < this.hurtboxes.length; h++) {
            let hurtbox = this.hurtboxes[h];

            for(let f = 0; f < floors.length; f++) {
                let floor = floors[f];
                if(
                    !this.jumping &&
                    (hurtbox.y >= floor.y && this.currentVerticalDir === 1) &&
                    ((hurtbox.y - hurtbox.height <= floor.y)) &&
                    ((hurtbox.x >= floor.x && hurtbox.x <= floor.x + floor.width) ||
                    (hurtbox.x + hurtbox.width >= floor.x && hurtbox.x + hurtbox.width <= floor.x + floor.width))
                ) {
                    hitFloor = true;
                    if(this.stun) {
                        this.stun = false;
                        this.currentSpeed = this.currentDir;
                    }
                    this.hurtboxes[0].y = floor.y;
                }
            }
            if(hitFloor) {
                this.jumpsRemaining = this.allowedJumps;
                this.currentFallSpeed = 0;
                break;
            } else if(this.jumpsRemaining === this.allowedJumps) {
                this.jumpsRemaining = this.allowedJumps - 1;
            }

            this.currentFallSpeed += gravity / (this.weight * this.game.fps);
            hurtbox.y += this.currentFallSpeed;
        }
    }
    
    jump(gravity, floors) {
        if(this.hurtboxes[0].y > this.jumpStart - this.jumpHeight) {
            this.currentFallSpeed -= gravity / (this.jumpPower * this.game.fps);
            this.hurtboxes[0].y += this.currentFallSpeed;
            this.jumping = true;
        } else if(!this.stun) {
            this.currentVerticalDir = 1;
        }
    }
}

class Hurtbox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Hitbox {
    constructor(xOffset, yOffset, width, height, damage, angle, knockback, growth, hitstun, startFrame, endFrame, cooldown) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;
        this.damage = damage;
        this.angle = angle;
        this.knockback = knockback;
        this.growth = growth;
        this.dir = 1;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.cooldown = cooldown;
        this.currentFrame = 0;
        this.active = false;

        let hitstunFrames = hitstun || 60;
        this.hitstun = (hitstunFrames / 60) * 1000;
    }
}

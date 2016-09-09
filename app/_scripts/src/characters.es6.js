/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.1
 *	07/09/2016
 *
 */

class Character {
    constructor(game, name, maxSpeed, acceleration, deceleration, currentDir, hurtboxes, turnDelay, actions) {
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

    move() {
        var acceleration = this.maxSpeed / (this.acceleration * this.game.fps);
        if(this.currentSpeed < this.maxSpeed) {
            this.currentSpeed += acceleration;
        }

        for(var i = 0; i < this.hurtboxes.length; i++) {
            this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
        }
    }

    stop() {
        var deceleration = this.maxSpeed / (this.deceleration * this.game.fps);
        if(this.currentSpeed > 0) {
            this.currentSpeed -= deceleration;
            if(this.currentSpeed < 0) this.currentSpeed = 0;
        }

        for(var i = 0; i < this.hurtboxes.length; i++) {
            this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
        }
    }

    turn() {
        this.currentSpeed = this.maxSpeed / (this.turnDelay * this.game.fps)
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

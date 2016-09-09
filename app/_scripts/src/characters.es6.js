/*
 *
 *	XL Platform Fighter/Characters
 *	XL Gaming/Declan Tyson
 *	v0.0.4
 *	08/09/2016
 *
 */

class Character {
    constructor(game, name, maxSpeed, acceleration, deceleration, currentDir, hurtboxes, turnDelay, weight, airSpeed) {
        this.game = game;

        // attributes
        this.name = name;
        this.maxSpeed = maxSpeed / this.game.fps;
        this.acceleration = acceleration;
        this.deceleration = deceleration;
        this.turnDelay = turnDelay;
        this.hurtboxes = hurtboxes;
        this.weight = weight;
        this.airSpeed = airSpeed / this.game.fps;

        // state
        this.currentSpeed = 0;
        this.currentFallSpeed = 0;
        this.currentDir = currentDir;
        this.currentVerticalDir = 1;
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
        var hitFloor = false;

        for(let h = 0; h < this.hurtboxes.length; h++) {
            let hurtbox = this.hurtboxes[h];
            for(let f = 0; f < floors.length; f++) {
                let floor = floors[f];
                if(
                    hurtbox.y == floor.startY &&
                    ((hurtbox.x >= floor.startX && hurtbox.x <= floor.endX) ||
                    (hurtbox.x + hurtbox.width >= floor.startX && hurtbox.x + hurtbox.width <= floor.endX))
                ) {
                    hitFloor = true;
                }
            }
            if(hitFloor) {
                this.currentFallSpeed = 0;
                break;
            }

            console.log(this.currentFallSpeed);

            this.currentFallSpeed += gravity / (this.weight * this.game.fps);
            hurtbox.y += this.currentVerticalDir * this.currentFallSpeed;
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

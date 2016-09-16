/*
 *
 *	XL Platform Fighter/Characters/AllAroundDude
 *	XL Gaming/Declan Tyson
 *	v0.0.9
 *	16/09/2016
 *
 */

class AllAroundDude extends Character {
    constructor(game, startPosY, startPosX) {
        super(game, startPosY, startPosX);
        var opts = {
            id: "AllAroundDude",
            name: "All Around Dude",
            maxSpeed: 400,
            acceleration: 2,
            deceleration:1,
            currentDir: 1,
            hurtboxes: [
                new Hurtbox(startPosY, startPosX, 15, 35)
            ],
            turnDelay: 0.15,
            weight: 1,
            airSpeed: 300,
            jumpPower: 4,
            jumpHeight: 10,
            allowedJumps: 2,
            jumpThreshold: {
                up: 5,
                down: 15
            }
        };

        super.initialise(opts);
    }
}
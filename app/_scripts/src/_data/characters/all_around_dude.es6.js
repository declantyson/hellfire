/*
 *
 *	XL Platform Fighter/Characters/AllAroundDude
 *	XL Gaming/Declan Tyson
 *	v0.0.5
 *	10/09/2016
 *
 */

class AllAroundDude extends Character {
    constructor(game, startPosY, startPosX) {
        super(game, startPosY, startPosX);
        var opts = {
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
            jumpPower: 1,
            jumpHeight: 20,
            allowedJumps: 2,
            jumpThreshold: 5
        };

        super.initialise(opts);
    }
}
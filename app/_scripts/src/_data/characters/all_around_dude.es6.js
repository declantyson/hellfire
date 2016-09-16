/*
 *
 *	XL Platform Fighter/Characters/AllAroundDude
 *	XL Gaming/Declan Tyson
 *	v0.0.18
 *	16/09/2016
 *
 */

class AllAroundDude extends Character {
    constructor(game, startPosX, startPosY) {
        super(game, startPosX, startPosY);
        var opts = {
            id: "AllAroundDude",
            name: "All Around Dude",
            maxSpeed: 400,
            acceleration: 2,
            deceleration:1,
            currentDir: 1,
            hurtboxes: [
                new Hurtbox(startPosX, startPosY, 15, 35)
            ],
            hitboxes: {
                basicAttack: [
                    new Hitbox(15, 20, 5, 5, 0, 45, 5, 0, 60, 8, 20, 7)
                ]
            },
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

    drawActions(stage) {
        super.drawActions(stage);
    }
}
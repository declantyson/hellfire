/*
 *
 *	Hellfire/Characters/AllAroundDude
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

import Fighter from '../engine/fighter';
import Hitbox from '../engine/hitbox';
import Hurtbox from '../engine/hurtbox';

class AllAroundDude extends Fighter {
    constructor(game, startPosX, startPosY) {
        super(game, startPosX, startPosY);
        const opts = {
            id: "AllAroundDude",
            name: "All Around Dude",
            maxSpeed: 400,
            acceleration: 2,
            deceleration:1,
            currentDir: 1,
            hurtboxes: [
                new Hurtbox(startPosX, startPosY, 18, 34)
            ],
            hitboxes: {
                basicAttack: [
                    new Hitbox({ name: "first", xOffset: 5, yOffset: 20, width: 5, height: 5, damage: 4, angle: 35, knockback: 2, growth: 0, hitstun: 60, startFrame: 8, endFrame: 14,  cooldown: 14}),
                    new Hitbox({ name: "extended", xOffset: 10, yOffset: 25, width: 10, height: 10, damage: 5, angle: 35, knockback: 2, growth: 0, hitstun: 25, startFrame: 14, endFrame: 21,  cooldown: 7})
                ],
                strongAttack: [
                    new Hitbox({ name: "front", xOffset: 1, yOffset: 25, width: 15, height: 15, damage: 20, angle: 15, knockback: 2, growth: 0, hitstun: 60, startFrame: 21, endFrame: 30,  cooldown: 14}),
                    new Hitbox({ name: "back", xOffset: 16, yOffset: 20, width: 15, height: 5, damage: 5, angle: 15, knockback: 3, growth: 0, hitstun: 60, startFrame: 21, endFrame: 30,  cooldown: 14})
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

export default AllAroundDude;
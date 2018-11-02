/*
 *
 *	Hellfire/Hitbox
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Hitbox {
  constructor(opts) {
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

    const hitstunFrames = opts.hitstun || 60;
    this.hitstun = (hitstunFrames / 60) * 1000;
  }
}

export default Hitbox;
/*
 *
 *	Hellfire/Fighter
 *	Declan Tyson
 *	v0.0.122
 *	14/11/2018
 *
 */

class Fighter {
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
    this.currentAttack = -1;
    this.invulnerable = false;
    this.visibleHitboxes = [];

    this.damage = 0;

    //TODO spritemaps
    let spriteSrc = `/sprites/${this.id}_s_${this.currentDir}.png`;
    this.sprite = new Image();
    this.sprite.src = spriteSrc;

    this.stockIcon = new Image();
    this.stockIcon.src = '/stock-icons/' + this.id + '.png';
  }

  drawActions(stage) {
    this.fall(stage.gravity, stage.floors);
    this.visibleHitboxes = [];

    for (let key in this.keyBindings.attacks) {
      if (this.game.currentKeys[this.keyBindings.attacks[key]] && !this.stun) {
        if (this.currentAttack === -1) this.currentAttack = this.keyBindings.attacks[key];
        if (this.currentAttack !== this.keyBindings.attacks[key]) continue;
        for (let i = 0; i < this.hitboxes[key].length; i++) {
          this.visibleHitboxes.push(this.hitboxes[key][i]);
        }
      } else {
        for (let i = 0; i < this.hitboxes[key].length; i++) {
          if (this.hitboxes[key][i].currentFrame > this.hitboxes[key][i].endFrame + this.hitboxes[key][i].cooldown) {
            this.hitboxes[key][i].currentFrame = 0;
            this.currentAttack = -1;
          }
          if (this.currentAttack === this.keyBindings.attacks[key]) {
            this.visibleHitboxes.push(this.hitboxes[key][i]);
          }
        }
        this.keysHeld[this.keyBindings[key]] = false;
      }
    }

    if (this.stun) {
      this.stop();
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


        if (

            this.jumpsRemaining === 0

        ) {
          return;
        }

        this.jumpStart = this.hurtboxes[0].y;
        this.currentVerticalDir = -1;
        this.currentFallSpeed = 0;
        this.jumpsRemaining--;
      }
    } else {
      this.jumpHeld = false;
    }

    if (!this.invulnerable) {
      for (let hurt = 0; hurt < this.hurtboxes.length; hurt++) {
        let hurtbox = this.hurtboxes[hurt];
        for (let c = 0; c < this.game.players.length; c++) {
          let character = this.game.players[c].character;
          if (this === character) continue;
          for (let hit = 0; hit < character.visibleHitboxes.length; hit++) {
            let hitbox = character.visibleHitboxes[hit];
            if (
              hitbox.active &&
              (hurtbox.x < hitbox.calculatedX + hitbox.width && hurtbox.x + hurtbox.width > hitbox.calculatedX) &&
              (hurtbox.y - hurtbox.height < character.hurtboxes[0].y - hitbox.yOffset &&
                hurtbox.y > character.hurtboxes[0].y - hitbox.yOffset - hitbox.height)
            ) {
              this.jumpStart = this.hurtboxes[0].y;
              this.getHit(hitbox);
              break;
            }
          }
        }
      }
    }

    if (
      this.hurtboxes[0].x < 0 ||
      this.hurtboxes[0].y < 0 ||
      this.hurtboxes[0].x > this.game.canvas.width ||
      this.hurtboxes[0].y > this.game.canvas.height
    ) {
      this.loseStock();
    }
  }

  loseStock() {
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

  getHit(hitbox) {
    const angleToSpeedModifier = hitbox.angle / 45;

    this.stun = true;
    this.invulnerable = true;

    this.currentVerticalDir = -1;
    this.currentFallSpeed = this.currentVerticalDir * angleToSpeedModifier * hitbox.knockback - (this.damage / 100 * hitbox.growth);

    this.damage += hitbox.damage;

    this.currentDir = hitbox.dir;
    this.currentSpeed = (1 / angleToSpeedModifier) * hitbox.knockback + (this.damage / 100 * hitbox.growth);

    let character = this;
    setTimeout(function() {
      character.invulnerable = false;
    }, (1000 / this.game.fps) * hitbox.cooldown);

    setTimeout(function() {
      character.stun = false;
    }, hitbox.hitstun);
  }

  hitstun() {
    //this.stop()
  }

  move() {
    let maxMovementSpeed = this.maxSpeed;
    if (this.currentFallSpeed > 0) maxMovementSpeed = this.airSpeed;

    let acceleration = maxMovementSpeed / (this.acceleration * this.game.fps);
    if (this.currentSpeed < maxMovementSpeed) {
      this.currentSpeed += acceleration;
    }

    for (let i = 0; i < this.hurtboxes.length; i++) {
      this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
    }
  }

  stop() {
    let deceleration = this.maxSpeed / (this.deceleration * this.game.fps);
    if (this.currentFallSpeed > 0) {
      deceleration = deceleration / 3;
    }

    if (this.currentSpeed > 0) {
      this.currentSpeed -= deceleration;
      if (this.currentSpeed < 0) this.currentSpeed = 0;

    }

    for (let i = 0; i < this.hurtboxes.length; i++) {
      this.hurtboxes[i].x += this.currentDir * this.currentSpeed;
    }
  }

  turn(dir) {
    if (this.currentSpeed === 0) return;

    let deceleration = this.maxSpeed / (this.turnDelay * this.game.fps);
    if (this.currentSpeed > 0) {
      this.currentSpeed -= deceleration;
      if (this.currentSpeed < 0) this.currentSpeed = 0;
    }

    if (this.currentSpeed === 0) {
      this.currentDir = dir;
      this.game.keyChanged = false;

      let spriteSrc = `/sprites/${this.id}_s_${this.currentDir}.png`;
      this.sprite.src = spriteSrc;
    }
  }

  fall(gravity, floors) {
    if (this.currentVerticalDir === -1 && !this.stun) {
      this.jump(gravity, floors);
      return;
    }

    if (this.currentFallSpeed > 0) {
      this.jumping = false;
    }

    let hitFloor = false;

    for (let h = 0; h < this.hurtboxes.length; h++) {
      let hurtbox = this.hurtboxes[h];

      for (let f = 0; f < floors.length; f++) {
        let floor = floors[f];

        if (
          !this.jumping &&
          (hurtbox.y >= floor.y && this.currentVerticalDir === 1) &&
          hurtbox.y - hurtbox.height <= floor.y &&
          ((hurtbox.x >= floor.x && hurtbox.x <= floor.x + floor.width) ||
            (hurtbox.x + hurtbox.width >= floor.x && hurtbox.x + hurtbox.width <= floor.x + floor.width))
        ) {
          hitFloor = true;
          if (this.stun) {
            this.stun = false;
            // this.currentSpeed = this.currentDir;
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
      if(this.currentFallSpeed > 0) this.currentVerticalDir = 1;
      hurtbox.y += this.currentFallSpeed;
    }
  }

  jump(gravity, floors) {
    if (this.hurtboxes[0].y > this.jumpStart - this.jumpHeight) {
      this.currentFallSpeed -= gravity / (this.jumpPower * this.game.fps);
      this.hurtboxes[0].y += this.currentFallSpeed;
      this.jumping = true;
    } else if (!this.stun) {
      this.currentVerticalDir = 1;
    }
  }
}

export default Fighter;

var Hellfire = (function (exports) {
'use strict';

/*
 *
 *	Hellfire/Fighter
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
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
        if (
          (this.currentVerticalDir === -1 &&
            this.jumpsRemaining < this.allowedJumps &&
            this.hurtboxes[0].y > this.jumpStart - this.jumpThreshold.up) ||
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

    this.currentVerticalDir = -1;
    this.currentFallSpeed = this.currentVerticalDir * angleToSpeedModifier * hitbox.knockback * (1 + this.damage / 100);

    this.damage += hitbox.damage;

    this.currentDir = hitbox.dir;
    this.currentSpeed = (1 / angleToSpeedModifier) * hitbox.knockback;

    //this.stun = true;
    this.invulnerable = true;

    let character = this;
    setTimeout(function() {
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
    if (this.currentVerticalDir === -1) {
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

/*
 *
 *	Hellfire/Floor
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Floor {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
  }
}

/*
 *
 *	Hellfire/Inputs
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

document.onkeydown = function(e) {
  if (!window.game.currentKeys[e.keyCode]) {
    window.game.keyChanged = true;
    window.game.currentKeys[e.keyCode] = true;
  }
};

document.onkeyup = function(e) {
  window.game.currentKeys[e.keyCode] = false;
};

/*
 *
 *	Hellfire/Game
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

/* Do not remove these despite what IntelliJ says!! */
class Game {
  constructor(element, width, height, fps) {
    this.canvas = document.getElementById(element);
    this.canvas.width = width;
    this.canvas.height = height;
    this.fps = fps;
    this.ctx = this.canvas.getContext('2d');
    this.currentKeys = [];
    this.keyChanged = false;
    this.startingStockCount = 4;
    this.visibleHitboxes = {};

    this.players = [];
  }

  gameOver() {
    setTimeout(function() {
      // TODO: Go to victory screen
      clearInterval(window.drawScene);
    }, 100);
  }
}

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

/*
 *
 *	Hellfire/Hurtbox
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Hurtbox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

/*
 *
 *	Hellfire/Player
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Player {
  constructor(character, keys) {
    this.character = character;
    this.character.keyBindings = {
      left: keys.left,
      jump: keys.jump,
      right: keys.right,
      attacks: {
        basicAttack: keys.basicAttack,
        strongAttack: keys.strongAttack,
      },
    };
  }
}

/*
 *
 *	Hellfire/Scene
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Scene {
  constructor(game, stage, players) {
    this.game = game;
    this.stage = stage;
    this.players = players;

    this.game.players = players;
    this.draw();
  }

  draw() {
    let pre_canvas = document.createElement('canvas');
    let pre_ctx = pre_canvas.getContext('2d');

    pre_canvas.height = this.game.canvas.height;
    pre_canvas.width = this.game.canvas.width;

    this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this.drawStageFloors(pre_ctx);
    this.drawCharacters(pre_ctx);
    this.drawCharacterDamage(pre_ctx);
    this.drawCharacterStocks(pre_ctx);
    for (let i = 0; i < this.players.length; i++) {
      this.characterActions(this.players[i].character);
      this.drawHitboxes(pre_ctx, this.players[i].character);
    }

    this.game.ctx.drawImage(pre_canvas, 0, 0);

    window.requestAnimationFrame(this.draw.bind(this));
  }

  drawStageFloors(pre_ctx) {
    for (let i = 0; i < this.stage.floors.length; i++) {
      let floor = this.stage.floors[i];

      pre_ctx.moveTo(floor.x, floor.y);
      pre_ctx.lineTo(floor.x + floor.width, floor.y);
      pre_ctx.stroke();
    }
  }

  drawCharacterDamage(pre_ctx) {
    pre_ctx.font = 'Helvetica Neue Light 20px';
    for (let p = 0; p < this.players.length; p++) {
      pre_ctx.fillText(this.players[p].character.damage + '%', p * 200 + 32, 90);
    }
  }

  drawCharacterStocks(pre_ctx) {
    this.players.forEach((player, p) => {
      for(let i = 0; i < player.character.stocks; i++) {
       pre_ctx.drawImage(player.character.stockIcon, p * 200 + 32 + 40 * i, 32);
      }
    });
  }

  drawCharacters(pre_ctx) {
    for (let i = 0; i < this.players.length; i++) {
      for (let h = 0; h < this.players[i].character.hurtboxes.length; h++) {
        let character = this.players[i].character;
        let hurtbox = character.hurtboxes[h];
        //pre_ctx.rect(hurtbox.x, hurtbox.y - hurtbox.height, hurtbox.width, hurtbox.height);

        if (character.currentDir !== 1) {
          
        }

        pre_ctx.drawImage(character.sprite, hurtbox.x, hurtbox.y - hurtbox.height, hurtbox.width, hurtbox.height);
        pre_ctx.stroke();
      }
    }
  }

  characterActions(character) {
    character.drawActions(this.stage);
  }

  drawHitboxes(pre_ctx, character) {
    for (let h = 0; h < character.visibleHitboxes.length; h++) {
      let hitbox = character.visibleHitboxes[h];
      hitbox.currentFrame++;
      if (hitbox.currentFrame >= hitbox.startFrame && hitbox.currentFrame <= hitbox.endFrame) {
        hitbox.active = true;
      } else if (hitbox.currentFrame > hitbox.endFrame) {
        hitbox.active = false;
      }

      if (!hitbox.active) continue;

      let baseHurtbox = character.hurtboxes[0];
      let baseX = baseHurtbox.x;
      if (character.currentDir === 1) {
        baseX += baseHurtbox.width;
      } else {
        baseX -= baseHurtbox.width;
      }

      hitbox.dir = character.currentDir;
      hitbox.calculatedX = baseX + hitbox.xOffset * character.currentDir;

      pre_ctx.strokeStyle = '#FF0000';
      pre_ctx.rect(hitbox.calculatedX, baseHurtbox.y - hitbox.yOffset, hitbox.width, hitbox.height);
      pre_ctx.stroke();
      pre_ctx.strokeStyle = '#000000';
    }
  }
}

/*
 *
 *	Hellfire/Stage
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class Stage {
  constructor(game, name, floors, gravity) {
    this.game = game;
    this.name = name;
    this.floors = floors;
    this.gravity = gravity / this.game.fps;
  }
}

/*
 *
 *	Hellfire/Characters/AllAroundDude
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class AllAroundDude extends Fighter {
  constructor(game, startPosX, startPosY) {
    super(game, startPosX, startPosY);
    const opts = {
      id: 'AllAroundDude',
      name: 'All Around Dude',
      maxSpeed: 400,
      acceleration: 2,
      deceleration: 1,
      currentDir: 1,
      hurtboxes: [new Hurtbox(startPosX, startPosY, 18, 34)],
      hitboxes: {
        basicAttack: [
          new Hitbox({
            name: 'first',
            xOffset: 5,
            yOffset: 20,
            width: 5,
            height: 5,
            damage: 4,
            angle: 35,
            knockback: 2,
            growth: 0,
            hitstun: 60,
            startFrame: 8,
            endFrame: 14,
            cooldown: 14,
          }),
          new Hitbox({
            name: 'extended',
            xOffset: 10,
            yOffset: 25,
            width: 10,
            height: 10,
            damage: 5,
            angle: 35,
            knockback: 2,
            growth: 0,
            hitstun: 25,
            startFrame: 14,
            endFrame: 21,
            cooldown: 7,
          }),
        ],
        strongAttack: [
          new Hitbox({
            name: 'front',
            xOffset: 1,
            yOffset: 25,
            width: 15,
            height: 15,
            damage: 20,
            angle: 15,
            knockback: 2,
            growth: 0,
            hitstun: 60,
            startFrame: 21,
            endFrame: 30,
            cooldown: 14,
          }),
          new Hitbox({
            name: 'back',
            xOffset: 16,
            yOffset: 20,
            width: 15,
            height: 5,
            damage: 5,
            angle: 15,
            knockback: 3,
            growth: 0,
            hitstun: 60,
            startFrame: 21,
            endFrame: 30,
            cooldown: 14,
          }),
        ],
      },
      turnDelay: 0.15,
      weight: 1,
      airSpeed: 300,
      jumpPower: 4,
      jumpHeight: 10,
      allowedJumps: 2,
      jumpThreshold: {
        up: 5,
        down: 15,
      },
    };



    super.initialise(opts);
  }

  drawActions(stage) {
    super.drawActions(stage);
  }
}

/*
 *
 *	Hellfire/Characters/AllAroundDude
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

class BasicStage extends Stage {
  constructor(game) {
    super(game, 'Basic Stage', [new Floor(100, 350, 600), new Floor(50, 250, 100), new Floor(650, 250, 100)], 1000);
  }
}

/*
 *
 *	Hellfire
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

// Enginer

exports.Fighter = Fighter;
exports.Floor = Floor;
exports.Game = Game;
exports.Hitbox = Hitbox;
exports.Hurtbox = Hurtbox;
exports.Player = Player;
exports.Scene = Scene;
exports.Stage = Stage;
exports.AllAroundDude = AllAroundDude;
exports.BasicStage = BasicStage;

return exports;

}({}));

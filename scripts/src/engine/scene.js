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

        let direction = 'right';
        if (character.currentDir !== 1) {
          direction = 'left';
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

export default Scene;

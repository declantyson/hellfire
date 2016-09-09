/*
 *
 *	XL Platform Fighter/Game
 *	XL Gaming/Declan Tyson
 *	v0.0.1
 *	07/09/2016
 *
 */

class Game {
    constructor(element, width, height, fps) {
        this.canvas = document.getElementById(element);
        this.canvas.width = width;
        this.canvas.height = height;
        this.fps = fps;
        this.ctx = this.canvas.getContext("2d");
        this.currentKey = -1;
        this.keyChanged = false;
    }
}

class Scene {
    constructor(game, stage, playerOne) {
        this.game = game;
        this.stage = stage;
        this.playerOne = playerOne;

        setInterval(this.draw.bind(this), 1000 / this.game.fps);
    }

    draw() {
        var pre_canvas = document.createElement('canvas'),
            pre_ctx = pre_canvas.getContext('2d');
        pre_canvas.height = this.game.canvas.height;
        pre_canvas.width = this.game.canvas.width;

        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        this.drawStageFloors(pre_ctx);
        this.drawCharacters(pre_ctx);
        this.characterActions(this.playerOne);

        this.game.ctx.drawImage(pre_canvas, 0, 0);
    }

    drawStageFloors(pre_ctx) {
        for (var i = 0; i < this.stage.floors.length; i++) {
            var floor = this.stage.floors[i];

            pre_ctx.moveTo(floor.startX, floor.startY);
            pre_ctx.lineTo(floor.endX, floor.endY);
            pre_ctx.stroke();
        }
    }

    drawCharacters(pre_ctx) {
        for (var i = 0; i < this.playerOne.hurtboxes.length; i++) {
            var hurtbox = this.playerOne.hurtboxes[i];
            pre_ctx.rect(hurtbox.x, hurtbox.y - hurtbox.height, hurtbox.width, hurtbox.height);
            pre_ctx.stroke();
        }
    }

    characterActions(character) {
        if(typeof keys[this.game.currentKey] === "undefined") return;
        var action = keys[this.game.currentKey];

        if(action == "right") {
            if(this.game.keyChanged) {
                character.turn();
                this.game.keyChanged = false;
            }
            character.currentDir = 1;
            character.move();
        } else if(action == "left") {
            if(this.game.keyChanged) {
                character.turn();
                this.game.keyChanged = false;
            }
            character.currentDir = -1;
            character.move();
        } else if(action == "stop") {
            character.stop();
        }
    }
}


var keys = {
    "-1" : "stop",
    "37" : "left",
    "39" : "right",
};

document.onkeydown = function (e) {
    if(activeGame.currentKey !== e.keyCode) {
        activeGame.keyChanged = true;
        activeGame.currentKey = e.keyCode;
    }
};

document.onkeyup = function () {
    activeGame.currentKey = -1;
};
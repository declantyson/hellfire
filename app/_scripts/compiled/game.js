'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Game
 *	XL Gaming/Declan Tyson
 *	v0.0.2
 *	07/09/2016
 *
 */

var Game = function Game(element, width, height, fps) {
    _classCallCheck(this, Game);

    this.canvas = document.getElementById(element);
    this.canvas.width = width;
    this.canvas.height = height;
    this.fps = fps;
    this.ctx = this.canvas.getContext("2d");
    this.currentKey = -1;
    this.keyChanged = false;
};

var Scene = function () {
    function Scene(game, stage, playerOne) {
        _classCallCheck(this, Scene);

        this.game = game;
        this.stage = stage;
        this.playerOne = playerOne;

        // this.draw();
        setInterval(this.draw.bind(this), 1000 / this.game.fps);
    }

    _createClass(Scene, [{
        key: 'draw',
        value: function draw() {
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
    }, {
        key: 'drawStageFloors',
        value: function drawStageFloors(pre_ctx) {
            for (var i = 0; i < this.stage.floors.length; i++) {
                var floor = this.stage.floors[i];

                pre_ctx.moveTo(floor.startX, floor.startY);
                pre_ctx.lineTo(floor.endX, floor.endY);
                pre_ctx.stroke();
            }
        }
    }, {
        key: 'drawCharacters',
        value: function drawCharacters(pre_ctx) {
            for (var i = 0; i < this.playerOne.hurtboxes.length; i++) {
                var hurtbox = this.playerOne.hurtboxes[i];
                pre_ctx.rect(hurtbox.x, hurtbox.y - hurtbox.height, hurtbox.width, hurtbox.height);
                pre_ctx.stroke();
            }
        }
    }, {
        key: 'characterActions',
        value: function characterActions(character) {
            character.fall(this.stage.gravity, this.stage.floors);

            if (typeof keys[this.game.currentKey] === "undefined") return;
            var action = keys[this.game.currentKey];

            if (action == "right") {
                if (this.game.keyChanged && character.currentDir !== 1) {
                    character.turn(1);
                }
                character.move();
            } else if (action == "left") {
                if (this.game.keyChanged && character.currentDir !== -1) {
                    character.turn(-1);
                }
                character.move();
            } else if (action == "stop") {
                character.stop();
            }
        }
    }]);

    return Scene;
}();

var keys = {
    "-1": "stop",
    "37": "left",
    "39": "right"
};

document.onkeydown = function (e) {
    if (activeGame.currentKey !== e.keyCode) {
        activeGame.keyChanged = true;
        activeGame.currentKey = e.keyCode;
    }
};

document.onkeyup = function () {
    activeGame.currentKey = -1;
};
//# sourceMappingURL=game.js.map

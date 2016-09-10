'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 *	XL Platform Fighter/Game
 *	XL Gaming/Declan Tyson
 *	v0.0.12
 *	10/09/2016
 *
 */

var Game = function Game(element, width, height, fps) {
    _classCallCheck(this, Game);

    this.canvas = document.getElementById(element);
    this.canvas.width = width;
    this.canvas.height = height;
    this.fps = fps;
    this.ctx = this.canvas.getContext("2d");
    this.currentKeys = [];
    this.keyChanged = false;
    this.keyBindings = {
        left: 37,
        jump: 38,
        right: 39
    };
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

                pre_ctx.moveTo(floor.x, floor.y);
                pre_ctx.lineTo(floor.x + floor.width, floor.y);
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
            character.drawActions(this.stage);
        }
    }]);

    return Scene;
}();

document.onkeydown = function (e) {
    if (!activeGame.currentKeys[e.keyCode]) {
        activeGame.keyChanged = true;
        activeGame.currentKeys[e.keyCode] = true;
    }
};

document.onkeyup = function (e) {
    activeGame.currentKeys[e.keyCode] = false;
};
//# sourceMappingURL=game.js.map

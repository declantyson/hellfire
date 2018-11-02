/*
 *
 *	Hellfire/Game
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

/* Do not remove these despite what IntelliJ says!! */
import * as input from './inputs';

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

export default Game;

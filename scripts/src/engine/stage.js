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

export default Stage;

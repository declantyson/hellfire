/*
 *
 *	Hellfire/Characters/AllAroundDude
 *	Declan Tyson
 *	v0.0.122
 *	14/11/2018
 *
 */

import Stage from '../engine/stage';
import Floor from '../engine/floor';

class BasicStage extends Stage {
  constructor(game) {
    super(game, 'Basic Stage', [new Floor(100, 350, 600), new Floor(50, 250, 100), new Floor(650, 250, 100), new Floor(250, 150, 100)], 1000);
  }
}

export default BasicStage;

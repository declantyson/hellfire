/*
 *
 *	Hellfire
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

import { Game, Player, Scene, AllAroundDude, BasicStage } from './main';

window.startGame = () => {
  window.game = new Game("stage", 800, 450, 60);
  const tempStage = new BasicStage(window.game);
  const tempCharacter = new AllAroundDude(window.game, 250, 350);
  const tempCharacter2 = new AllAroundDude(window.game, 550, 350);
  const playerOne = new Player(tempCharacter, { left: 37, right: 39, jump: 38, basicAttack: 16, strongAttack: 90 });
  const playerTwo = new Player(tempCharacter2, { left: 65, right: 68, jump: 87, });
  const tempScene = new Scene(window.game, tempStage, [playerOne, playerTwo]);
};
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
      left  : keys.left,
      jump  : keys.jump,
      right : keys.right,
      attacks: {
        basicAttack: keys.basicAttack,
        strongAttack: keys.strongAttack
      }
    };
  }
}

export default Player;
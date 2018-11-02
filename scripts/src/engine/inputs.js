/*
 *
 *	Hellfire/Inputs
 *	Declan Tyson
 *	v0.0.120
 *	02/11/2018
 *
 */

document.onkeydown = function (e) {
  if(!window.game.currentKeys[e.keyCode]) {
    window.game.keyChanged = true;
    window.game.currentKeys[e.keyCode] = true;
  }
};

document.onkeyup = function (e) {
  window.game.currentKeys[e.keyCode] = false;
};
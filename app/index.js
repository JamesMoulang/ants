import Game from './Game';

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	canvas.style.zIndex = -100;
	var game = new Game(1024, 768, canvas, ctx, 30);
	game.start();
};
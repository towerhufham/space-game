var shootsfx;
var shotdownsfx;
var damagesfx;
var gameoversfx;

function preloadAudio(game) {
	game.load.audio("SHOOT", "audio/shooty_low.wav");
	game.load.audio("SHOT DOWN", "audio/shotdown.wav");
	game.load.audio("DAMAGED", "audio/splody.wav");
	game.load.audio("GAME OVER", "audio/glitchy.wav");
}

function loadAudio(game) {
	shootsfx = game.add.audio("SHOOT", 0.25);
	shotdownsfx = game.add.audio("SHOT DOWN", 0.25);
	damagesfx = game.add.audio("DAMAGED", 0.25);
	gameoversfx = game.add.audio("GAME OVER", 0.25);
}
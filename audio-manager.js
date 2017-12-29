var shootsfx;
var shotdownsfx;
var damagesfx;
var gameoversfx;
var polypsfx;
var energysfx;
var reflectorsfx;
var gatesfx;
var explodersfx

function preloadAudio(game) {
	game.load.audio("SHOOT", "audio/shooty_low.wav");
	game.load.audio("SHOT DOWN", "audio/shotdown.wav");
	game.load.audio("DAMAGED", "audio/splody.wav");
	game.load.audio("GAME OVER", "audio/glitchy.wav");
	game.load.audio("POLYP", "audio/polyp.wav");
	game.load.audio("HOLLOW", "audio/hollow.wav");
	game.load.audio("REFLECTOR", "audio/reflector2.wav");
	game.load.audio("GATE", "audio/smallsplode.wav");
	game.load.audio("EXPLODER", "audio/bigsplode.wav");
}

function loadAudio(game) {
	shootsfx = game.add.audio("SHOOT", 0.25);
	shotdownsfx = game.add.audio("SHOT DOWN", 0.25);
	damagesfx = game.add.audio("DAMAGED", 0.25);
	gameoversfx = game.add.audio("GAME OVER", 0.25);
	polypsfx = game.add.audio("POLYP", 0.25);
	energysfx = game.add.audio("HOLLOW", 0.25);
	reflectorsfx = game.add.audio("REFLECTOR", 0.25);
	gatesfx = game.add.audio("GATE", 0.25);
	explodersfx = game.add.audio("EXPLODER", 0.25);
}
var shootsfx;
var shotdownsfx;
var damagesfx;
var gameoversfx;
var polypsfx;
var energysfx;
var reflectorsfx;
var gatesfx;
var explodersfx;
var furnacesfx;
var slidersfx;
var grasssfx;
var virgosfx;
var zodiacsfx

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
	game.load.audio("FURNACE", "audio/furnace.wav");
	game.load.audio("SLIDER", "audio/slider.wav");
	game.load.audio("GRASS", "audio/grass.wav");
	game.load.audio("VIRGO", "audio/squishy.wav");
	game.load.audio("ZODIAC", "audio/powerup.wav");
}

function loadAudio(game) {
	shootsfx = game.sound.add("SHOOT", 0.25);
	shotdownsfx = game.sound.add("SHOT DOWN", 0.25);
	damagesfx = game.sound.add("DAMAGED", 0.25);
	gameoversfx = game.sound.add("GAME OVER", 0.25);
	polypsfx = game.sound.add("POLYP", 0.25);
	energysfx = game.sound.add("HOLLOW", 0.25);
	reflectorsfx = game.sound.add("REFLECTOR", 0.25);
	gatesfx = game.sound.add("GATE", 0.25);
	explodersfx = game.sound.add("EXPLODER", 0.25);
	furnacesfx = game.sound.add("FURNACE", 0.25);
	slidersfx = game.sound.add("SLIDER", 0.25);
	grasssfx = game.sound.add("GRASS", 0.15);
	virgosfx = game.sound.add("VIRGO", 0.5);
	zodiacsfx = game.sound.add("ZODIAC", 0.5);
}
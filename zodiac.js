//zodiac flags
var ARIES = false;
var TAURUS = false;
var GEMINI = false;
var CANCER = false;
var LEO = false;
var VIRGO = false;
var LIBRA = false;
var SCORPIO = false;
var SAGITTARIUS = false;
var CAPRICORN = false;
var AQUARIUS = false;
var PISCES = true;
//list of zodiac signs, minus taurus
var zodiacs = ["aries", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
//where we'll keep the powerups
var powerups;

function preloadZodiac() {
	//load images into cache
	for (var i = 0; i < zodiacs.length; i++) {
		console.log("loading " + ("img/zodiac/" + zodiacs[i] + ".png"));
		game.load.image(zodiacs[i], "img/zodiac/" + zodiacs[i] + ".png");
	}
}

function loadZodiac() {
	//make sure the powerups are empty (maybe we're reloading?)
	powerups = game.add.group();
	powerups.enableBody = true;
	powerups.physicsBodyType = Phaser.Physics.ARCADE;
	for (var i = 0; i < zodiacs.length; i++) {
		var z = powerups.create(100*i, 100, zodiacs[i]);
		z.sign = zodiacs[i];
	}
	powerups.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	powerups.callAll("body.enableBody", true);
	powerups.setAll("body.collideWorldBounds", true);
	powerups.setAll("body.worldBounce", new Phaser.Point(1, 1));
}

function magnetZodiac() {
	if (player.canMagnet) {
		powerups.forEachAlive(function(e){
			var dist = Phaser.Math.distance(e.x, e.y, player.x, player.y);
			if (dist < 125) {
				var angle = game.physics.arcade.angleBetween(e, player);
				angle *= Phaser.Math.RAD_TO_DEG;  //why tf does phaser use two different angle notations without converting automatically
				var vel = game.physics.arcade.velocityFromAngle(angle, 450);
				e.body.velocity = vel;
			}
		}, this);
	}
}

function givePower(z) {
	switch (z.sign) {
		case "aries":
			ARIES = true;
			break;
		case "taurus":
			TAURUS = true;
			break;
		case "gemini":
			GEMINI = true;
			break;
		case "cancer":
			CANCER = true;
			break;
		case "leo":
			LEO = true;
			break;
		case "virgo":
			VIRGO = true;
			break;
		case "libra":
			LIBRA = true;
			break;
		case "scorpio":
			SCORPIO = true;
			break;
		case "sagittarius":
			SAGITTARIUS = true;
			break;
		case "capricorn":
			CAPRICORN = true;
			break;
		case "aquarius":
			AQUARIUS = true;
			break;
		case "pisces":
			PISCES = true;
			break;
		default:
			console.log("z.sign isn't an expect value: " + z.sign);
			break;
	}
	z.kill();
	zodiacsfx.play();
}
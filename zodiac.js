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
var PISCES = false;
//list of zodiac signs, minus taurus
var zodiacs = ["aries", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
//where we'll keep the powerups
var powerups;

function preloadZodiac() {
	//load images into cache
	for (var i = 0; i < zodiacs.length; i++) {
		game.load.image(zodiacs[i], "img/zodiac/" + zodiacs[i] + ".png");
	}
}

function loadZodiac() {
	//make sure the powerups are empty (maybe we're reloading?)
	powerups = game.add.group();
	powerups.enableBody = true;
	powerups.physicsBodyType = Phaser.Physics.ARCADE;
	for (var i = 0; i < zodiacs.length; i++) {
		var z = powerups.create(-1000, -1000, zodiacs[i]);
		z.sign = zodiacs[i];
	}
	powerups.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	powerups.callAll("body.enableBody", true);
	powerups.setAll("body.collideWorldBounds", true);
	powerups.setAll("body.worldBounce", new Phaser.Point(1, 1));
	powerups.setAll("body.drag", new Phaser.Point(200, 200));
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

function dropZodiac(x, y, vel = null) {
	var z = powerups.getRandom();
	z.revive();
	z.x = x;
	z.y = y;
	if (vel) {
		z.body.velocity.x = vel.x;
		z.body.velocity.y = vel.y;
	}
}

function givePower(z) {
	switch (z.sign) {
		case "aries":
			ARIES = true;
			dropAlert(strings["aries-m"], strings["aries-s"]);
			break;
		case "taurus":
			TAURUS = true;
			dropAlert(strings["taurus-m"], strings["taurus-s"]);
			break;
		case "gemini":
			GEMINI = true;
			dropAlert(strings["gemini-m"], strings["gemini-s"]);
			break;
		case "cancer":
			CANCER = true;
			dropAlert(strings["cancer-m"], strings["cancer-s"]);
			break;
		case "leo":
			LEO = true;
			dropAlert(strings["leo-m"], strings["leo-s"]);
			break;
		case "virgo":
			VIRGO = true;
			dropAlert(strings["virgo-m"], strings["virgo-s"]);
			break;
		case "libra":
			LIBRA = true;
			dropAlert(strings["libra-m"], strings["libra-s"]);
			break;
		case "scorpio":
			SCORPIO = true;
			dropAlert(strings["scorpio-m"], strings["scorpio-s"]);
			break;
		case "sagittarius":
			SAGITTARIUS = true;
			dropAlert(strings["sagittarius-m"], strings["sagittarius-s"]);
			break;
		case "capricorn":
			CAPRICORN = true;
			dropAlert(strings["capricorn-m"], strings["capricorn-s"]);
			break;
		case "aquarius":
			AQUARIUS = true;
			dropAlert(strings["aquarius-m"], strings["aquarius-s"]);
			break;
		case "pisces":
			PISCES = true;
			dropAlert(strings["pisces-m"], strings["pisces-s"]);
			break;
		default:
			console.log("z.sign isn't an expect value: " + z.sign);
			break;
	}
	z.kill();
	zodiacsfx.play();
}
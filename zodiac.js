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
	powerups = [];
	for (var i = 0; i < zodiacs.length; i++) {
		var z = game.add.sprite(100*i, 100, zodiacs[i]);
		powerups.push(z);
	}
}


// WORK IN PROGRESS

var parallax;
var _halfWidth;
var _halfHeight;

function makeParallax(game, key, width=3840, height=3840) {
	parallax = game.add.tileSprite(0, 0, width, height, key);
	// parallax.fixedToCamera = true;
	_halfWidth = game.world.width / 2;
	_halfHeight = game.world.height / 2;
	console.log(_halfWidth, _halfHeight);
	parallax.scrollAmount = 0.5;
}

function setParallaxScroll(n) {
	parallax.scrollAmount = n;
}


//updates the parallax's position based on the player (or some other sprite)'s location
function updateParallax(sprite) {
	parallax.x = (sprite.x - _halfWidth)  * parallax.scrollAmount;
	parallax.y = (sprite.y - _halfHeight) * parallax.scrollAmount;
}

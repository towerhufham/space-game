var crabs;
var CRAB_ACCEL = 2;
var CRAB_SHOT = 4; //this number is doubled and then ++'d

//we take in a player as an argument because some functions use the player's pos
function loadCrabs(game, player, rate) {
	//create crab group (note: speed is irrelevant for the crabs' behavior)
	crabs = makeEnemyGroup(game, player, "CRAB", rate, 0, crabFire, crabUpdate);
	return crabs;
}

function crabFire(crab, game, player) {
	//checking to make sure the crab & laser exists prevents a strange bug
	//only fire if the player is close
	if (crab.alive && Phaser.Math.distance(crab.x, crab.y, player.x, player.y) < 800) {
		crab.animations.frame = 1;
		game.time.events.add(500, function(){crab.animations.frame = 0;}, this);
		for (var i = -CRAB_SHOT; i < CRAB_SHOT+1; i++) {
			var angle = game.physics.arcade.angleBetween(crab, player);
			angle += (i * 0.1);
			fireAtAngle(game, crab, angle);
		}
		shootsfx.play();
	}
}

function crabUpdate(en, game, player) {
	//just check for bounds
	en.outOfBounds = false;
	if (en.x < 0 || en.y < 0 || en.x > 3840 || en.y > 3840) {
		en.outOfBounds = true;
	}
	//rotate towards player
	en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
	//move towards player
	en.body.velocity.x += (CRAB_ACCEL * Math.sign(player.x - en.x)); 
	en.body.velocity.y += (CRAB_ACCEL * Math.sign(player.y - en.y)); 
}
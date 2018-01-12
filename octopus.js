var octopuses;

//we take in a player as an argument because some functions use the player's pos
function loadOctopuses(game, player, rate) {
	//create octopus group
	octopuses = makeEnemyGroup(game, player, "OCTO", rate, 0.5, octopusFire, 800);
	octopuses.setAll("body.maxVelocity.x", 200);
	octopuses.setAll("body.maxVelocity.y", 200);
	return octopuses;
}

function octopusFire(octopus, game, player) {
	//checking to make sure the octopus & laser exists prevents a strange bug
	//only fire if the player is close
	if (octopus.alive && Phaser.Math.distance(octopus.x, octopus.y, player.x, player.y) < 500) {
		octopus.animations.frame = 1;
		game.time.events.add(500, function(){octopus.animations.frame = 0;}, this);
		for (var i = -3; i < 4; i++) {
			var angle = game.physics.arcade.angleBetween(octopus, player);
			angle += (i * 0.1);
			fireAtAngle(game, octopus, angle);
		}
		shootsfx.play();
	}
}
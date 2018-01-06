var octopuses;

//we take in a player as an argument because some functions use the player's pos
function loadOctopuses(game, player, enemyGroups) {
	//create octopus group
	octopuses = makeEnemyGroup(game, player, "OCTO", 800, 200, octopusFire);
	return octopuses;
}

function octopusFire(octopus, game, player) {
	//checking to make sure the octopus & laser exists prevents a strange bug
	//only fire if the player is close
	if (octopus.alive && Phaser.Math.distance(octopus.x, octopus.y, player.x, player.y) < 500) {
		octopus.animations.frame = 1;
		game.time.events.add(500, function(){octopus.animations.frame = 0;}, this);
		for (var i = -2; i < 3; i++) {
			var angle = game.physics.arcade.angleBetween(octopus, player);
			angle += (i * 0.1);
			fireAtAngle(game, octopus, angle);
		}
		shootsfx.play();
	}
}
var octopuses;
var octopusSpeed = 200;

//we take in a player as an argument because some functions use the player's pos
function loadOctopuses(game, player, enemyGroups) {
	//create octopus group
	octopuses = game.add.group();
	octopuses.enableBody = true;
	octopuses.physicsBodyType = Phaser.Physics.ARCADE;
	octopuses.createMultiple(50, "OCTO-CLOSED");
	octopuses.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){spawnOctopus(game, player);}, this);
	timer.loop(1000, function(){octopuses.forEachAlive(octopusFire, this, game, player);});
	timer.start();
	
	//give update for each lobster
	octopuses.extraUpdate = function(){octopuses.forEachAlive(turretUpdate, this, game, player);};
	
	//provide a way to clear out this group when the game resets
	octopuses.clearFunc = function() {
		octopuses.callAll("kill");
		timer.destroy();
	}
	
	return octopuses;
}

function octopusFire(octopus, game, player) {
	//checking to make sure the octopus & laser exists prevents a strange bug
	//only fire if the player is close
	if (octopus && Phaser.Math.distance(octopus.x, octopus.y, player.x, player.y) < 500) {
		octopus.loadTexture("OCTO-OPEN");
		game.time.events.add(500, function(){octopus.loadTexture("OCTO-CLOSED");}, this);
		for (var i = -2; i < 3; i++) {
			var angle = game.physics.arcade.angleBetween(octopus, player);
			angle += (i * 0.1);
			fireAtAngle(game, octopus, angle, 400);
		}
	}
}

function spawnOctopus(game, player) {
	if (octopuses.countDead() > 0) {
		var side = game.rnd.between(0,3);
		var x;
		var y;
		if (side === 0) {
			//left
			x = -50;
			y = game.rnd.between(0, game.world.height);
		} else if (side === 1) {
			//top
			x = game.rnd.between(0, game.world.width);
			y = -50
		} else if (side === 2) {
			//right
			x = game.world.width + 50;
			y = game.rnd.between(0, game.world.height);
		} else if (side === 3) {
			//bottom
			x = game.rnd.between(0, game.world.width);
			y = game.world.height + 50;
		}
		var octo = octopuses.getFirstDead();
		octo.reset(x, y);
		octo.rotation = game.physics.arcade.angleToXY(octo, player.x, player.y);
		game.physics.arcade.moveToXY(octo, player.x, player.y, octopusSpeed);
		octopusFire(octo, game, player);
	}
}

function octopusUpdate(octo, game, player) {
	octo.rotation = game.physics.arcade.angleToXY(octo, player.x, player.y);
}
var octopuses;
var octopusLasers;
var octopusSpeed = 200;
var octopusLaserSpeed = 500;

//we take in a player as an argument because some functions use the player's pos
function loadOctopuses(game, player) {
	//add octopus lasers
	octopusLasers = game.add.group();
    octopusLasers.enableBody = true;
    octopusLasers.physicsBodyType = Phaser.Physics.ARCADE;

    octopusLasers.createMultiple(50, "RED BEAM");
    octopusLasers.setAll("checkWorldBounds", true);
    octopusLasers.setAll("outOfBoundsKill", true);
	
	//create octopus group
	octopuses = game.add.group();
	octopuses.enableBody = true;
	octopuses.physicsBodyType = Phaser.Physics.ARCADE;
	octopuses.createMultiple(50, "PLACEHOLDER");
	octopuses.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//timer
	timer = game.time.create(false);
	timer.loop(1000, function(){spawnOctopus(game, player);}, this);
	timer.loop(1000, function(){octopuses.forEachAlive(octopusFire, this, game, player);});
	timer.start();
}

function octopusFire(octopus, game, player) {
	//checking to make sure the octopus & laser exists prevents a strange bug
	if (octopus) {
		for (var i = 0; i < 5; i++) {
			var laser = octopusLasers.getFirstDead();
			if (laser) {
				var angle = game.physics.arcade.angleBetween(e, player);
				laser.reset(octopus.x, octopus.y);
				laser.rotation = octopus.rotation;
				
				shootsfx.play();
			}
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
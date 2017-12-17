var turretLasers;
var turrets;
var turretSpeed = 200;
var turretLaserSpeed = 600;

//we take in a player as an argument because some functions use the player's pos
function loadTurrets(game, player) {
	//add turret lasers
	turretLasers = game.add.group();
    turretLasers.enableBody = true;
    turretLasers.physicsBodyType = Phaser.Physics.ARCADE;

    turretLasers.createMultiple(50, "RED BEAM");
    turretLasers.setAll("checkWorldBounds", true);
    turretLasers.setAll("outOfBoundsKill", true);
	
	//create turret group
	turrets = game.add.group();
	turrets.enableBody = true;
	turrets.physicsBodyType = Phaser.Physics.ARCADE;
	turrets.createMultiple(50, "TURRET");
	turrets.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//turret timer
	// timer = game.time.create(false);
	// timer.loop(1000, function(){spawnTurret(game, player);}, this);
	// timer.loop(1000, function(){turrets.forEachAlive(turretFire, this, game, player);});
	// timer.start();
}

function turretFire(turret, game, player) {
	//checking to make sure the turret & laser exists prevents a strange bug
	if (turret) {
		var laser = turretLasers.getFirstDead();
		if (laser) {
			laser.reset(turret.x, turret.y);
			laser.rotation = turret.rotation;
			game.physics.arcade.moveToXY(laser, player.x, player.y, turretLaserSpeed);
			shootsfx.play();
		}
	}
}

function spawnTurret(game, player) {
	if (turrets.countDead() > 0) {
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
		var turret = turrets.getFirstDead();
		turret.reset(x, y);
		turret.rotation = game.physics.arcade.angleToXY(turret, player.x, player.y);
		game.physics.arcade.moveToXY(turret, player.x, player.y, turretSpeed);
		turretFire(turret, game, player);
	}
}
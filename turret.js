var turrets;
var turretSpeed = 200;

//we take in a player as an argument because some functions use the player's pos
function loadTurrets(game, player, enemyGroups) {	
	//create turret group
	turrets = game.add.group();
	turrets.enableBody = true;
	turrets.physicsBodyType = Phaser.Physics.ARCADE;
	turrets.createMultiple(50, "TURRET");
	turrets.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//turret timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){spawnTurret(game, player);}, this);
	timer.loop(1000, function(){turrets.forEachAlive(turretFire, this, game, player);});
	timer.start();
	
	//give update for each turret
	turrets.extraUpdate = function(){turrets.forEachAlive(turretUpdate, this, game, player);};
	
	//provide a way to clear out this group when the game resets
	turrets.clearFunc = function() {
		turrets.callAll("kill");
		timer.destroy();
	}
	
	return turrets;
}

function turretFire(turret, game, player) {
	fireAtSprite(game, turret, player);
	shootsfx.play();
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

function turretUpdate(turret, game, player) {
	turret.rotation = game.physics.arcade.angleToXY(turret, player.x, player.y);
}
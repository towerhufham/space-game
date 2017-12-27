//we take in a player as an argument because some functions use the player's pos
function makeEnemyGroup(game, player, key, speed, fireFunction, newUpdate = "default") {
	//create enemy group
	var newEnemies = game.add.group();
	newEnemies.enableBody = true;
	newEnemies.physicsBodyType = Phaser.Physics.ARCADE;
	newEnemies.createMultiple(50, key);
	newEnemies.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	newEnemies.fire = fireFunction;
	
	//give update for each enemy
	if (newUpdate === "default") {
		newEnemies.extraUpdate = function(){newEnemies.forEachAlive(defaultUpdate, this, game, player);};
	} else {
		newEnemies.extraUpdate = function(){newEnemies.forEachAlive(newUpdate, this, game, player);};
	}
	
	//provide a way to clear out this group when the game resets
	newEnemies.clearFunc = function() {
		newEnemies.callAll("kill");
		timer.destroy();
	}
	
	//timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){basicSpawn(newEnemies, speed, game, player);}, this);
	timer.loop(1000, function(){newEnemies.forEachAlive(newEnemies.fire, this, game, player);});
	timer.start();
	
	return newEnemies;
}

function basicSpawn(enemyGroup, speed, game, player) {
	//this is the basic spawn code
	if (enemyGroup.countDead() > 0) {
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
		var en = enemyGroup.getFirstDead();
		en.reset(x, y);
		en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
		game.physics.arcade.moveToXY(en, player.x, player.y, speed);
		console.log(enemyGroup);
		enemyGroup.fire(en, game, player);
		//kill enemy when it is out of bounds after 2 seconds
		game.time.events.add(2000, function(){
			en.checkWorldBounds = true;
			en.outOfBoundsKill = true;
		}, this);
	}
}

function defaultUpdate(en, game, player) {
	//default aim-at-player behavior
	en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
}
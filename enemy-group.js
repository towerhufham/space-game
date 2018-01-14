//we take in a player as an argument because some functions use the player's pos
function makeEnemyGroup(game, player, key, spawntime, accel, fireFunction, fireRate, newUpdate = "default") {
	//create enemy group
	var newEnemies = game.add.group();
	newEnemies.enableBody = true;
	newEnemies.physicsBodyType = Phaser.Physics.ARCADE;
	newEnemies.createMultiple(15, key);
	newEnemies.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	newEnemies.setAll("body.drag.x", 1);
	newEnemies.setAll("body.drag.y", 1);
	// newEnemies.setAll("body.maxVelocity.x", 500);
	// newEnemies.setAll("body.maxVelocity.y", 500);
	newEnemies.fire = fireFunction;
	//for easily identifying enemies from other objects
	newEnemies.forEach(function(en){en.isEnemy=true;},this);
	
	//give update for each enemy
	if (newUpdate === "default") {
		newEnemies.extraUpdate = function(){newEnemies.forEachAlive(defaultUpdate, this, game, player, accel);};
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
	timer.loop(spawntime, function(){basicSpawn(newEnemies, game, player);}, this);
	timer.loop(fireRate, function(){newEnemies.forEachAlive(newEnemies.fire, this, game, player);});
	timer.start();
	
	return newEnemies;
}

function basicSpawn(enemyGroup, game, player) {
	//this is the basic spawn code
	if (currentEnemies < MAX_ENEMIES) {
		var en = enemyGroup.getFirstDead();
		if (en) {
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
			en.reset(x, y);
			en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
			enemyGroup.fire(en, game, player);
			//used by the map
			en.outOfBounds = true;
			en.boundsKill = false;
			game.time.events.add(2000, function(){en.boundsKill = true;}, this);
			currentEnemies++;
		}
	}
}

function _dist(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function defaultUpdate(en, game, player, accel) {
	//default aim-at-player behavior
	en.outOfBounds = false;
	if (en.x < 0 || en.y < 0 || en.x > 3840 || en.y > 3840) {
		en.outOfBounds = true;
	}
	if (en.outOfBounds && en.boundsKill) {
		en.kill();
		en.boundsKill = false;
		currentEnemies--;
	}
	en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
	//move towards player
	en.body.velocity.x += (accel * Math.sign(player.x - en.x)); 
	en.body.velocity.y += (accel * Math.sign(player.y - en.y)); 
	//don't overshoot too much
	if (_dist(en.x, en.y, player.x, player.y) < 350) {
		en.body.velocity.x /= 1.01;
		en.body.velocity.y /= 1.01;
	}
}
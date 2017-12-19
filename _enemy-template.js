var newEnemies;
var newEnemiesSpeed = 200;

//we take in a player as an argument because some functions use the player's pos
function loadnewEnemies(game, player, enemyGroups) {
	//create enemy group
	newEnemies = game.add.group();
	newEnemies.enableBody = true;
	newEnemies.physicsBodyType = Phaser.Physics.ARCADE;
	newEnemies.createMultiple(50, "PLACEHOLDER");
	newEnemies.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){spawnnewEnemies(game, player);}, this);
	timer.loop(1000, function(){newEnemies.forEachAlive(newEnemiesFire, this, game, player);});
	timer.start();
	
	//provide a way to clear out this group when the game resets
	newEnemies.clearFunc = function() {
		newEnemies.callAll("kill");
		timer.destroy();
	}
	
	return newEnemies;
}

function newEnemiesFire(enemy, game, player) {
	//checking to make sure the enemy & laser exists prevents a strange bug
	// STUFF
}

function spawnnewEnemies(game, player) {
	//this is the basic spawn code
	if (newEnemies.countDead() > 0) {
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
		var en = newEnemies.getFirstDead();
		en.reset(x, y);
		en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
		game.physics.arcade.moveToXY(en, player.x, player.y, newEnemiesSpeed);
		newEnemiesFire(en, game, player);
	}
}
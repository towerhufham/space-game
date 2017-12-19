var lobsters;
var lobstersSpeed = 200;
var lobsterGraphics;

//we take in a player as an argument because some functions use the player's pos
function loadLobsters(game, player, enemyGroups) {
	//create enemy group
	lobsters = game.add.group();
	lobsters.enableBody = true;
	lobsters.physicsBodyType = Phaser.Physics.ARCADE;
	lobsters.createMultiple(50, "PLACEHOLDER");
	lobsters.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){spawnLobsters(game, player);}, this);
	timer.loop(1000, function(){lobsters.forEachAlive(lobstersFire, this, game, player);});
	timer.start();
	
	//beam graphics
	lobsterGraphics = game.add.graphics();
	
	//give update for each lobster
	lobsters.extraUpdate = function(){lobsters.ForEachAlive(lobsterUpdate, this);};
	
	//provide a way to clear out this group when the game resets
	lobsters.clearFunc = function() {
		lobsters.callAll("kill");
		lobsterGraphics.clear();
		lobsterGraphics = null;
		timer.destroy();
	}
	
	return lobsters;
}

function lobstersFire(lobster, game, player) {
	//checking to make sure the enemy & laser exists prevents a strange bug
	lobster.body.stop();
	lobster.isFiring = true;
	lobsterGraphics.lineStyle(3, 0x660000, 0.5);
	lobsterGraphics.moveTo(lobster.x, lobster.y);
	var p = _extendLine(lobster.x, lobster.y, player.x, player.y);
	lobsterGraphics.lineTo(p.x, p.y);
}

function finishLobsterFire(lobster) {
	lobster.isFiring = false;
}

function _extendLine(x1, y1, x2, y2, extendLength = 3000) {
	var p = {x:null, y:null};
	var len = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
	p.x = x2 + (x2 - x1) / len * extendLength;
	p.y = y2 + (y2 - y1) / len * extendLength;
	return p;
}

function spawnLobsters(game, player) {
	//this is the basic spawn code
	if (lobsters.countDead() > 0) {
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
		var en = lobsters.getFirstDead();
		en.reset(x, y);
		en.rotation = game.physics.arcade.angleToXY(en, player.x, player.y);
		game.physics.arcade.moveToXY(en, player.x, player.y, lobstersSpeed);
	}
}

function lobsterUpdate(lobster) {
	
}
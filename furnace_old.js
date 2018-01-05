var furnaces;

function loadFurnaces(game) {
	//load furnaces
	furnaces = game.add.group();
	furnaces.enableBody = true;
	furnaces.physicsBodyType = Phaser.Physics.ARCADE;
	furnaces.createMultiple(50, "FURNACE");
	furnaces.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	furnaces.setAll("body.immovable", true);
	
	//timer
	var timer = game.time.create(false);
	timer.loop(5000, function(){furnaces.forEachAlive(furnaceFire);}, this);
	timer.start();
}

function furnaceFire(furn) {
	console.log("firing");
	fireAtAngle(game, furn, 0);
	fireAtAngle(game, furn, Math.PI/2);
	fireAtAngle(game, furn, Math.PI);
	fireAtAngle(game, furn, 3*Math.PI/2);
}

function spawnFurnaces(m) {
	for (var i = 0; i < m.length; i++) {
		var e = furnaces.getFirstDead();
		if (e) {
			e.revive();
			e.x = m[i].x;
			e.y = m[i].y;
		}
	}
}
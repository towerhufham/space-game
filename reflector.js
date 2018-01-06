var reflectors;

function loadReflectors(game, amount) {
	//load reflectors
	reflectors = game.add.group();
	reflectors.enableBody = true;
	reflectors.physicsBodyType = Phaser.Physics.ARCADE;
	reflectors.createMultiple(amount, "REFLECTOR");
	reflectors.callAll("anchor.setTo", "anchor", 0.5, 0.5);
}

function spawnReflectors(reflectorMap) {
	for (var i = 0; i < reflectorMap.length; i++) {
		var e = reflectors.getFirstDead();
		if (e) {
			e.revive();
			e.x = reflectorMap[i].x;
			e.y = reflectorMap[i].y;
		}
	}
}

//reflection logic is in collision.js
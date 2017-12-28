var reflectors;

function loadReflectors(game) {
	//load reflectors
	reflectors = game.add.group();
	reflectors.enableBody = true;
	reflectors.physicsBodyType = Phaser.Physics.ARCADE;
	reflectors.createMultiple(25, "REFLECTOR");
	reflectors.callAll("anchor.setTo", "anchor", 0.5, 0.5);
}

function spawnReflectors(reflectorMap) {
	for (var i = 0; i < reflectorMap.length; i++) {
		var p = reflectors.getFirstDead();
		p.revive();
		p.x = reflectorMap[i].x;
		p.y = reflectorMap[i].y;
	}
}

//reflection logic is in collision.js
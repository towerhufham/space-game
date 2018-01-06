var blades;

function loadBlades(game, amount) {
	//load blades
	blades = game.add.group();
	blades.enableBody = true;
	blades.physicsBodyType = Phaser.Physics.ARCADE;
	blades.createMultiple(amount, "BLADE");
	blades.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	blades.setAll("body.angularVelocity", 360);
}

function spawnBlades(bladeMap) {
	for (var i = 0; i < bladeMap.length; i++) {
		var e = blades.getFirstDead();
		if (e) {
			e.revive();
			e.x = bladeMap[i].x;
			e.y = bladeMap[i].y;
		}
	}
}

//damage logic is in collision.js
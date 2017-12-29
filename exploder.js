var exploders;

function loadExploders(game) {
	//load exploders
	exploders = game.add.group();
	exploders.enableBody = true;
	exploders.physicsBodyType = Phaser.Physics.ARCADE;
	exploders.createMultiple(25, "EXPLODER");
	exploders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	exploders.setAll("body.immovable", true);
}

function spawnExploders(exploderMap) {
	for (var i = 0; i < exploderMap.length; i++) {
		var e = exploders.getFirstDead();
		if (e) {
			e.revive();
			e.x = exploderMap[i].x;
			e.y = exploderMap[i].y;
		}
	}
}

//explosion logic is in collision.js
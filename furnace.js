var furnaces;
var blobs;
var ALLOWED_FURNACES = 50;
var BLOBS_PER_FURNACE = 7;

function loadFurnaces(game) {
	//load furnaces
	furnaces = game.add.group();
	furnaces.enableBody = true;
	furnaces.physicsBodyType = Phaser.Physics.ARCADE;
	furnaces.createMultiple(ALLOWED_FURNACES, "FURNACE");
	furnaces.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	furnaces.setAll("body.immovable", true);
	
	//load blobs
	blobs = game.add.group();
	blobs.enableBody = true;
	blobs.physicsBodyType = Phaser.Physics.ARCADE;
	blobs.createMultiple(ALLOWED_FURNACES * BLOBS_PER_FURNACE, "GRENADE");
	blobs.callAll("body.enableBody", true);
	blobs.setAll("body.collideWorldBounds", true);
	blobs.setAll("body.worldBounce", new Phaser.Point(1, 1));
	blobs.callAll("anchor.setTo", "anchor", 0.5, 0.5);
}

function setFurnaceToExplode(furn) {
	// var t = game.rnd.between(6000, 8000);
	var t = game.rnd.between(6000, 45000);
	game.time.events.add(t, function(){
		explodeFurnace(furn);
	}, this);
}

function explodeFurnace(furn, flashtime=1500) {
	if (furn) {
		flashSprite(furn, flashtime);
		game.time.events.add(flashtime, function(){
			if (furn) {
				for (var i = 0; i < BLOBS_PER_FURNACE; i++) {
					var b = blobs.getFirstDead();
					if (b) {
						b.revive();
						b.x = furn.x;
						b.y = furn.y;
						b.body.velocity.x = random.between(0, 200) * random.sign();
						b.body.velocity.y = random.between(0, 200) * random.sign();
						b.body.drag.x = 200;
						b.body.drag.y = 200;
						b.angle = random.angle();
					}
				}
				if (furn.inCamera) {
					furnacesfx.play();
				}
				furn.kill();
			}
		}, this);
	}
}

function spawnFurnaces(m) {
	for (var i = 0; i < m.length; i++) {
		var e = furnaces.getFirstDead();
		if (e) {
			e.revive();
			e.x = m[i].x;
			e.y = m[i].y;
			setFurnaceToExplode(e);
		}
	}
}
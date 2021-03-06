var furnaces;
var blobs;
var BLOBS_PER_FURNACE = 5;
var MAX_BLOBS = 130;
var currentBlobs = 0;

function loadFurnaces(game, amount) {
	//load furnaces
	furnaces = game.add.group();
	furnaces.enableBody = true;
	furnaces.physicsBodyType = Phaser.Physics.ARCADE;
	furnaces.createMultiple(amount, "FURNACE");
	furnaces.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	furnaces.setAll("body.immovable", true);
	
	//load blobs
	blobs = game.add.group();
	blobs.enableBody = true;
	blobs.physicsBodyType = Phaser.Physics.ARCADE;
	blobs.createMultiple(amount * BLOBS_PER_FURNACE, "BLOB");
	blobs.callAll("body.enableBody", true);
	blobs.setAll("body.collideWorldBounds", true);
	blobs.setAll("body.worldBounce", new Phaser.Point(1, 1));
	blobs.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	currentBlobs = 0;
}

function setFurnaceToExplode(furn) {
	// var t = game.rnd.between(6000, 8000);
	var t = game.rnd.between(6000, 45000);
	game.time.events.add(t, function(){
		explodeFurnace(furn);
	}, this);
}

function explodeFurnace(furn, flashtime=1500) {
	if (furn.alive) {
		flashSprite(furn, flashtime);
		game.time.events.add(flashtime, function(){
			if (furn.alive) {
				for (var i = 0; i < BLOBS_PER_FURNACE; i++) {
					var b = blobs.getFirstDead();
					if (b) {
						//spawn blob
						b.revive();
						b.x = furn.x;
						b.y = furn.y;
						b.body.velocity.x = random.between(0, 200) * random.sign();
						b.body.velocity.y = random.between(0, 200) * random.sign();
						b.body.drag.x = 200;
						b.body.drag.y = 200;
						b.angle = random.angle();
						//update blob count
						currentBlobs++;
						//if there are too many blobs, kill some so the player doesn't lag out
						if (currentBlobs > MAX_BLOBS) {
							blobs.getRandomExists().kill();
						}
					}
				}
				//checking if it's alive IS necessary
				if (furn.alive) {
					if (furn.inCamera) {
						furnacesfx.play();
					}
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
var grenaders;
var grenades;

function loadGrenaders(game) {
	//load grenaders
	grenaders = game.add.group();
	grenaders.enableBody = true;
	grenaders.physicsBodyType = Phaser.Physics.ARCADE;
	grenaders.createMultiple(25, "GRENADER");
	grenaders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	grenaders.setAll("body.immovable", true);
	
	//load grenades
	grenades = game.add.group();
	grenades.enableBody = true;
	grenades.physicsBodyType = Phaser.Physics.ARCADE;
	grenades.createMultiple(30, "GRENADE");
	grenades.callAll("body.enableBody", true);
	grenades.setAll("body.collideWorldBounds", true);
	grenades.setAll("body.worldBounce", new Phaser.Point(1, 1));
	
	//timer
	var timer = game.time.create(false);
	timer.loop(1000, function(){grenaders.forEachAlive(makeGrenades);}, this);
	timer.start();
}

function spawnGrenaders(grenaderMap) {
	for (var i = 0; i < grenaderMap.length; i++) {
		var e = grenaders.getFirstDead();
		if (e) {
			e.revive();
			e.x = grenaderMap[i].x;
			e.y = grenaderMap[i].y;
		}
	}
}

function makeGrenades(grenader) {
	if (grenader.inCamera) {
		for (var i = 0; i < 1; i++) {
			var g = grenades.getFirstDead();
			if (g) {
				g.revive();
				g.x = grenader.x;
				g.y = grenader.y;
				g.body.velocity.x = random.between(100, 200) * random.sign();
				g.body.velocity.y = random.between(100, 200) * random.sign();
				g.body.drag.x = 200;
				g.body.drag.y = 200;
				g.angle = random.angle();
				g.anchor.setTo(0.5, 0.5);
				game.time.events.add(1000, function(){
					//NOTE: this won't destroy tiles (and possibly crash) until i fix explosion.js
					// explosion(g.x, g.y);
					g.kill();
				}, this);
			}
		}
	}
}
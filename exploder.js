var exploders;

function loadExploders(game) {
	//load exploders
	exploders = game.add.group();
	exploders.enableBody = true;
	exploders.physicsBodyType = Phaser.Physics.ARCADE;
	exploders.createMultiple(25, "EXPLODER");
	exploders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	exploders.setAll("body.immovable", true);
	exploders.forEach(function(ex){ex.isExploding=false;},this);
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

function explodeExploder(ex) {
	//only explode if in camera
	if (ex.inCamera) {
		ex.isExploding = true;
		explodersfx.play();
		screenShake();
		//these formulas are just the placement formulas in reverse
		var tilex = (ex.x - 32) / 64
		var tiley = (ex.y - 32) / 64
		//destroy tiles
		//ortho
		if (tilemap.getTile(tilex+1, tiley, 0, true)) {
			tilemap.removeTile(tilex+1, tiley, 0);
		}
		if (tilemap.getTile(tilex-1, tiley, 0, true)) {
			tilemap.removeTile(tilex-1, tiley, 0);
		}
		if (tilemap.getTile(tilex, tiley+1, 0, true)) {
			tilemap.removeTile(tilex, tiley+1, 0);
		}
		if (tilemap.getTile(tilex, tiley-1, 0, true)) {
			tilemap.removeTile(tilex, tiley-1, 0);
		}
		//diag
		if (tilemap.getTile(tilex+1, tiley-1, 0, true)) {
			tilemap.removeTile(tilex+1, tiley-1, 0);
		}
		if (tilemap.getTile(tilex-1, tiley+1, 0, true)) {
			tilemap.removeTile(tilex-1, tiley+1, 0);
		}
		if (tilemap.getTile(tilex+1, tiley+1, 0, true)) {
			tilemap.removeTile(tilex+1, tiley+1, 0);
		}
		if (tilemap.getTile(tilex-1, tiley-1, 0, true)) {
			tilemap.removeTile(tilex-1, tiley-1, 0);
		}
		//random extra tiles, so it doesn't feel too predictable
		for (var i = 0; i < 10; i++) {
			var xmod = game.rnd.between(-2, 2);
			var ymod = game.rnd.between(-2, 2);
			if (tilemap.getTile(tilex+xmod, tiley+ymod, 0, true)) {
				tilemap.removeTile(tilex+xmod, tiley+xmod, 0);
			}
		}
		//create blast
		var blast = game.add.sprite(ex.x, ex.y, "EXPLOSION");
		blast.anchor.setTo(0.5, 0.5);
		blast.lifespan = 500;
		
		//if player in radius, damage them
		if (Phaser.Math.distance(blast.x, blast.y, player.x, player.y) <= 112) {
			damagePlayer();
		}
		
		//if enemies in radius, kill them
		for (var i = 0; i < enemyGroups.length; i++) {
			enemyGroups[i].forEachAlive(function(e){
				if (Phaser.Math.distance(blast.x, blast.y, e.x, e.y) <= 112) {
					e.kill();
					shotdownsfx.play();
				}
			}, this);
		}
		
		//if another exploder is in radius, explode it
		game.time.events.add(200, function() {
			exploders.forEachAlive(function(otherEx) {
				if (!otherEx.isExploding && Phaser.Math.distance(blast.x, blast.y, otherEx.x, otherEx.y) <= 122) {
					explodeExploder(otherEx);
				}
			}, this);
		}, this);
		
		
		//finish
		ex.isExploding = false;
		ex.kill();
	}
}
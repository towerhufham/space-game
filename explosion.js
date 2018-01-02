function explosion(x, y) {
	explodersfx.play();
	screenShake();
	//these formulas are just the placement formulas in reverse
	var tilex = Math.round((x - 32) / 64);
	var tiley = Math.round((y - 32) / 64);
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
	//create blast effects
	for (var i = 0; i < 10; i++) {
		var blast = game.add.sprite(x - game.rnd.between(-75, 75), y - game.rnd.between(-75, 75), "EXPLOSION");
		blast.anchor.setTo(0.5, 0.5);
		blast.lifespan = game.rnd.between(250, 750);
		// blast.angle = game.rnd.between(0, 360);
		game.add.tween(blast).to({alpha: 0}, blast.lifespan, Phaser.Easing.Sinusoidal.Out, true);
		game.add.tween(blast).to({angle: game.rnd.between(-360, 360)}, blast.lifespan, Phaser.Easing.Quadratic.Out, true);
	}
	
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
	
	//if an exploder is in radius, explode it
	game.time.events.add(200, function() {
		exploders.forEachAlive(function(otherEx) {
			if (!otherEx.isExploding && Phaser.Math.distance(blast.x, blast.y, otherEx.x, otherEx.y) <= 122) {
				explodeExploder(otherEx);
			}
		}, this);
	}, this);
}
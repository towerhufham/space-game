var grass;
var grassParticles;

function loadGrass(game, amount) {
	//load grass
	grass = game.add.group();
	grass.enableBody = true;
	grass.physicsBodyType = Phaser.Physics.ARCADE;
	grass.createMultiple(amount, "GRASS");
	grass.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	grass.setAll("body.immovable", true);
	
	grassParticles = game.add.emitter(0, 0, 100);
	grassParticles.makeParticles("BLADE-OF-GRASS");
	grassParticles.setAlpha(0.75, 0, 1500);
	grassParticles.gravity = 0;
}

function spawnGrass(m) {
	for (var i = 0; i < m.length; i++) {
		var e = grass.getFirstDead();
		if (e) {
			e.revive();
			e.x = m[i].x;
			e.y = m[i].y;
		}
	}
}

function explodeGrass(gr) {
	//only explode if alive & in camera
	if (gr.alive) {
		grassParticles.x = gr.x;
		grassParticles.y = gr.y;
		grassParticles.start(true, 1000, null, 25);
		gr.kill();
	}
}
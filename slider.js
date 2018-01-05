var sliders;

function loadSliders(game) {
	//load sliders
	sliders = game.add.group();
	sliders.enableBody = true;
	sliders.physicsBodyType = Phaser.Physics.ARCADE;
	sliders.createMultiple(25, "SLIDER");
	sliders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
}

function spawnSliders(m) {
	for (var i = 0; i < m.length; i++) {
		var e = sliders.getFirstDead();
		if (e) {
			e.revive();
			e.x = m[i].x;
			e.y = m[i].y;
		}
	}
}
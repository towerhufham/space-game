function makePhantom(parent, key) {
	var phantom = game.add.emitter(0, 0, 50);
	phantom.makeParticles(key);
	// phantom.setAngle(0, 0);
	// phantom.setRotation(0, 0);
	phantom.setXSpeed(0, 0);
	phantom.setYSpeed(0, 0);
	phantom.setSize(15, 15);
	phantom.setAlpha(0.2, 0, 1000)
	phantom.gravity = new Phaser.Point(0, 0);
	phantom.maxParticleSpeed = new Phaser.Point(0, 0);
	phantom.particleAnchor = new Phaser.Point(0.5, 0.5);
	phantom.maxSpeed = 0;
	
	phantom.flow(1000, 100);
	parent.phantom = phantom;
	phantom.x = parent.x;
	phantom.y = parent.y;
	console.log(phantom);
}

	
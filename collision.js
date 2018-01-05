//a utility function to check if two non-physics enabled sprites are overlapping
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function doCollisions() {
	// gate collision
	if (checkOverlap(player, gate)) {
		playerVSgate();
	}
	// collisions
	game.physics.arcade.collide(player, tileLayer);
	game.physics.arcade.collide(energies, tileLayer);
	game.physics.arcade.collide(grenades, tileLayer);
	game.physics.arcade.collide(playerLasers, tileLayer, laserVStile);
	game.physics.arcade.collide(enemyLasers, tileLayer, laserVStile);
	game.physics.arcade.collide(player, exploders);
	game.physics.arcade.collide(player, polyps);
	game.physics.arcade.collide(player, furnaces);
	game.physics.arcade.collide(blobs, tileLayer);
	game.physics.arcade.collide(sliders, tileLayer);
	game.physics.arcade.collide(sliders, sliders);
	// sprite overlaps
	game.physics.arcade.overlap(turrets, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(octopuses, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(polyps, playerLasers, polypVSlaser, null, this);
	game.physics.arcade.overlap(player, enemyLasers, playerVSbadlaser, null, this);
	game.physics.arcade.overlap(player, energies, playerVSenergy, null, this);
	game.physics.arcade.overlap(player, blobs, damagePlayer);
	game.physics.arcade.overlap(enemyLasers, reflectors, enemylaserVSreflector, null, this);
	game.physics.arcade.overlap(playerLasers, reflectors, playerlaserVSreflector, null, this);
	game.physics.arcade.overlap(player, blades, playerVSblade, null, this);
	game.physics.arcade.overlap(enemyLasers, exploders, laserVSexploder, null, this);
	game.physics.arcade.overlap(playerLasers, exploders, laserVSexploder, null, this);
	game.physics.arcade.overlap(playerLasers, furnaces, laserVSfurnace, null, this);
	game.physics.arcade.overlap(enemyLasers, furnaces, laserVSfurnace, null, this);
	game.physics.arcade.overlap(player, sliders, damagePlayer);
}

function killLaser(laser) {
	laser.beenReflected = null;
	laser.kill();
}

function laserVStile(laser, tile) {
	//not sure what type tile is
	for (var i = 0; i < 4; i++) {
		var debris = game.add.sprite(laser.x + game.rnd.between(-5, 5), laser.y + game.rnd.between(-5, 5), "DEBRIS");
		debris.anchor.setTo(0, 0.5);
		debris.angle = laser.angle + game.rnd.between(-45, 45);
		debris.lifespan = 150 + game.rnd.between(-25, 25);
		game.physics.enable(debris);
		debris.body.angularVelocity = {x: game.rnd.between(0, 200), y: game.rnd.between(0, 200)};
		debris.body.velocity.setToPolar(debris.rotation - Math.PI, 150 + game.rnd.between(50, 150));
		// debris.alpha = 1;
		game.add.tween(debris).to({alpha: 0}, debris.lifespan, Phaser.Easing.Linear.None, true);
	}
	killLaser(laser);
}

function playerVSgate() {
	if (gate.open) {
		currentLevel++;
		resetGame();
	}
}

function playerVSbadlaser(player, laser) {
	killLaser(laser);
	damagePlayer();
}

function enemyVSlaser(enemy, laser) {
	shotdownsfx.play();
	killcount++;
	enemyParticles.x = enemy.x;
	enemyParticles.y = enemy.y;
	enemyParticles.start(true, 1000, null, 10);
	enemy.kill();
}

function polypVSlaser(polyp, laser) {
	//spawn energies
	spawnEnergies(polyp);
	//do regular collision stuff
	polypsfx.play();
	polyp.kill();
	polypShockwave(polyp);
	killLaser(laser);
}

function playerVSenergy(player, energy) {
	energy.kill();
	currentEnergy++;
	energysfx.play();
	if (currentEnergy >= 20) {
		openGate();
	}
	updateEnergyBar()
}

function enemylaserVSreflector(laser, reflector) {
	if (!laser.beenReflected) {
		killLaser(laser);
		var angle = game.rnd.angle() * (Math.PI / 180);
		reflector.rotation = angle;
		fireAtAngle(game, reflector, angle);
		laser.beenReflected = true;
		game.time.events.add(800, function(){laser.beenReflected = false;}, this);
		if (reflector.inCamera) {
			reflectorsfx.play();
		}
	}
}

function playerlaserVSreflector(laser, reflector) {
	if (!laser.beenReflected) {
		killLaser(laser);
		var angle = game.rnd.angle() * (Math.PI / 180);
		reflector.rotation = angle;
		playerFireAtAngle(game, reflector, angle);
		laser.beenReflected = true;
		game.time.events.add(1500, function(){laser.beenReflected = false;}, this);
		if (reflector.inCamera) {
			reflectorsfx.play();
		}
	}
}

function playerVSblade(player, blade) {
	damagePlayer();
}

function laserVSexploder(laser, exploder) {
	killLaser(laser);
	explodeExploder(exploder);
}

function laserVSfurnace(laser, furnace) {
	laser.kill();
	explodeFurnace(furnace, 0);
}
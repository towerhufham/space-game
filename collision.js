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
	// tile collisions
	game.physics.arcade.collide(player, tileLayer);
	game.physics.arcade.collide(energies, tileLayer);
	game.physics.arcade.collide(playerLasers, tileLayer, killLaser);
	game.physics.arcade.collide(enemyLasers, tileLayer, killLaser);
	// sprite collisions
	game.physics.arcade.overlap(turrets, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(octopuses, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(polyps, playerLasers, polypVSlaser, null, this);
	game.physics.arcade.overlap(player, enemyLasers, playerVSbadlaser, null, this);
	game.physics.arcade.overlap(player, energies, playerVSenergy, null, this);
	game.physics.arcade.collide(player, exploders);
	game.physics.arcade.collide(player, polyps);
	//extra collisions
	game.physics.arcade.overlap(enemyLasers, reflectors, enemylaserVSreflector, null, this);
	game.physics.arcade.overlap(playerLasers, reflectors, playerlaserVSreflector, null, this);
	game.physics.arcade.overlap(player, blades, playerVSblade, null, this);
	game.physics.arcade.overlap(enemyLasers, exploders, laserVSexploder, null, this);
	game.physics.arcade.overlap(playerLasers, exploders, laserVSexploder, null, this);
}

function killLaser(laser) {
	laser.beenReflected = null;
	laser.kill();
}

function playerVSgate() {
	if (gate.open) {
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
	killLaser(laser);
}

function playerVSenergy(player, energy) {
	energy.kill();
	currentEnergy++;
	energysfx.play();
	if (currentEnergy >= 20) {
		openGate();
	}
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
	exploder.kill();
	explodersfx.play();
	screenShake();
}
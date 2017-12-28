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
}

function playerVSgate() {
	if (gate.open) {
		resetGame();
	}
}

function playerVSbadlaser(player, laser) {
	if (!godmode) {
		laser.kill();
		screenShake();
		damagesfx.play();
		damagePlayer();
	}
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
	laser.kill();
}

function playerVSenergy(player, energy) {
	energy.kill();
	currentEnergy++;
	energysfx.play();
	if (currentEnergy >= 20) {
		openGate();
	}
}
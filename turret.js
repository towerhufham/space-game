var turrets;

//we take in a player as an argument because some functions use the player's pos
function loadTurrets(game, player, rate) {	
	//create turret group
	turrets = makeEnemyGroup(game, player, "TURRET", rate, 1, turretFire, 500);
	return turrets;
}

function turretFire(turret, game, player) {
	for (var i = -1; i < 2; i++) {
		var angle = game.physics.arcade.angleBetween(turret, player);
		angle += (i * 0.2);
		fireAtAngle(game, turret, angle, turret.body.speed+150);
	}
	// shootsfx.play();
}
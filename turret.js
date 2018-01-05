var turrets;

//we take in a player as an argument because some functions use the player's pos
function loadTurrets(game, player, enemyGroups) {	
	//create turret group
	turrets = makeEnemyGroup(game, player, "TURRET", 800, 200, turretFire);
	return turrets;
}

function turretFire(turret, game, player) {
	fireAtSprite(game, turret, player);
	shootsfx.play();
}
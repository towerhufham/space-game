var turrets;

//we take in a player as an argument because some functions use the player's pos
function loadTurrets(game, player, rate) {	
	//create turret group
	turrets = makeEnemyGroup(game, player, "TURRET", rate, 200, turretFire);
	console.log("rate = " + rate);
	return turrets;
}

function turretFire(turret, game, player) {
	fireAtSprite(game, turret, player);
	shootsfx.play();
}
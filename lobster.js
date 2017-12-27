var lobsters;
var lobstersSpeed = 200;
var lobsterGraphics;

//we take in a player as an argument because some functions use the player's pos
function loadLobsters(game, player, enemyGroups) {
	//create enemy group
	lobsters = makeEnemyGroup(game, player, "PLACEHOLDER", 200, lobsterFire, lobsterUpdate);
	lobsterGraphics = game.add.graphics();
	return lobsters;
}

function lobsterFire(lobster, game, player) {
	//checking to make sure the enemy & laser exists prevents a strange bug
	lobster.body.stop();
	lobster.isFiring = true;
	lobsterGraphics.lineStyle(3, 0x660000, 0.5);
	lobsterGraphics.moveTo(lobster.x, lobster.y);
	var p = _extendLine(lobster.x, lobster.y, player.x, player.y);
	lobsterGraphics.lineTo(p.x, p.y);
}

function finishLobsterFire(lobster) {
	lobster.isFiring = false;
}

function _extendLine(x1, y1, x2, y2, extendLength = 3000) {
	var p = {x:null, y:null};
	var len = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
	p.x = x2 + (x2 - x1) / len * extendLength;
	p.y = y2 + (y2 - y1) / len * extendLength;
	return p;
}

function lobsterUpdate(lobster, game, player) {
	lobster.rotation = game.physics.arcade.angleToXY(lobster, player.x, player.y);
	lobster.rotation = game.physics.arcade.angleToXY(lobster, player.x, player.y);
}
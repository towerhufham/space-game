var enemyLasers;
var _defaultSpeed = 450;

function loadEnemyLasers(game) {
	//add group
	enemyLasers = game.add.group();
    enemyLasers.enableBody = true;
    enemyLasers.physicsBodyType = Phaser.Physics.ARCADE;
    enemyLasers.createMultiple(100, "RED BEAM");
    enemyLasers.setAll("checkWorldBounds", true);
    enemyLasers.setAll("outOfBoundsKill", true);
}

function fireAtSprite(game, source, sprite, speed = _defaultSpeed) {
	var laser = enemyLasers.getFirstDead();
	if (laser) {
		laser.reset(source.x, source.y);
		laser.rotation = game.physics.arcade.angleBetween(source, sprite);
		game.physics.arcade.moveToXY(laser, sprite.x, sprite.y, speed);
	}
}

function fireAtAngle(game, source, angle, speed = _defaultSpeed) {
	//in radians
	var laser = enemyLasers.getFirstDead();
	if (laser) {
		laser.reset(source.x, source.y);
		laser.rotation = angle;
		laser.body.velocity.setToPolar(angle, speed);
	}
}
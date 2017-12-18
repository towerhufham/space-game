var enemyLasers;

function loadEnemyLasers(game) {
	//add group
	enemyLasers = game.add.group();
    enemyLasers.enableBody = true;
    enemyLasers.physicsBodyType = Phaser.Physics.ARCADE;
    enemyLasers.createMultiple(100, "RED BEAM");
    enemyLasers.setAll("checkWorldBounds", true);
    enemyLasers.setAll("outOfBoundsKill", true);
}

function fireAtSprite(game, source, sprite, speed = 600) {
	var laser = enemyLasers.getFirstDead();
	if (laser) {
		laser.reset(source.x, source.y);
		laser.rotation = game.physics.arcade.angleBetween(source, sprite);
		game.physics.arcade.moveToXY(laser, sprite.x, sprite.y, speed);
	}
}
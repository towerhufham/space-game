require(["audio-manager", "turret"], function(){

var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var player;
var health = 3;
var killcount = 0;
var graphics;
var random;
var debugText;
var ACCEL = 20;
var SPEED = 400;
var DEACCEL = 10;
var fireRate = 100;
var nextFire = 0;
var playerLaserSpeed = 600;
var playerLasers;


function preload() {
	//images
	game.load.image("BACKGROUND", "img/tempbg.jpg");
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.image("TURRET", "img/turret.png");
	game.load.image("BLUE BEAM", "img/beam.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	
	//audio
	preloadAudio(game);
}

function create() {
	//init random
	random = game.rnd;
	
	//size the world
	game.world.setBounds(0, 0, 1920, 1920);
	
	//add background
	game.add.tileSprite(0, 0, 1920, 1920, "BACKGROUND");
	
	//init graphics object
	graphics = game.add.graphics();
	
	//add player lasers
	playerLasers = game.add.group();
    playerLasers.enableBody = true;
    playerLasers.physicsBodyType = Phaser.Physics.ARCADE;

    playerLasers.createMultiple(50, "BLUE BEAM");
    playerLasers.setAll("checkWorldBounds", true);
    playerLasers.setAll("outOfBoundsKill", true);
	
	//add player
	player = game.add.sprite(game.world.width/2, game.world.height/2, "TRIANGLE");
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player);
	player.body.maxVelocity = {x: SPEED, y: SPEED};
	game.camera.follow(player);
	// game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	
	//load turrets
	loadTurrets(game, player);
	
	//init audio
	loadAudio(game);
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 0, "( - )", style);
	debugText.fixedToCamera = true;
}

function update() {
	//collision
	game.physics.arcade.overlap(turrets, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(player, turretLasers, playerVSbadlaser, null, this);
	
	//angle
	player.rotation = game.physics.arcade.angleToPointer(player);
	
	//horizontal velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
		player.body.velocity.x -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
		player.body.velocity.x += ACCEL;
	} else {
		player.body.velocity.x += Math.sign(player.body.velocity.x) * -DEACCEL;
	}
	//stop sliding
	if (player.body.velocity.x < 5 && player.body.velocity.x > -5) {
		player.body.velocity.x = 0;
	}
	
	//vertical velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
		player.body.velocity.y -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
		player.body.velocity.y += ACCEL;
	} else {
		player.body.velocity.y += Math.sign(player.body.velocity.y) * -DEACCEL;
	}
	//stop sliding
	if (player.body.velocity.y < 5 && player.body.velocity.y > -5) {
		player.body.velocity.y = 0;
	}
	
	//fire
	if (game.input.activePointer.leftButton.isDown) {
		playerFire();
	}
	
	//draw aim
	drawPlayerAim();
	
	//enemies aim
	turrets.forEachAlive(angleTowardsPlayer, this);
	
	debugText.text = "Score: " + killcount;
}

function drawPlayerAim() {
	graphics.clear(); //clears this graphic object's stuff
	if (player.alive) {
		graphics.lineStyle(2, 0xFFFFFF, 0.5);
		graphics.moveTo(player.x, player.y);
		// graphics.lineTo(game.input.mousePointer.x, game.input.mousePointer.y);
		graphics.lineTo(game.input.mousePointer.worldX, game.input.mousePointer.worldY);
	}
}

function playerFire() {
	if (game.time.now > nextFire && playerLasers.countDead() > 0 && player.alive === true) {
		nextFire = game.time.now + fireRate;
		var laser = playerLasers.getFirstDead();
		laser.reset(player.x, player.y);
		laser.angle = player.angle;
		game.physics.arcade.moveToPointer(laser, playerLaserSpeed);
		//too annoying
		//shootsfx.play();
    }
}

// function spawnTurret() {
	// var x = random.between(0, game.world.width);
	// var y = random.between(0, game.world.height);
	// if (turrets.countDead() > 0) {
		// var turret = turrets.getFirstDead();
		// turret.reset(x, y);
		// turret.rotation = game.physics.arcade.angleToXY(turret, player.x, player.y);
		// turretFire(turret);
	// }
// }

function angleTowardsPlayer(sprite) {
	sprite.rotation = game.physics.arcade.angleToXY(sprite, player.x, player.y);
}

function screenShake() {
	//shakes the screen based on how damaged the player is
	if (health >= 2) {
		game.camera.shake(0.0075, 250);
	} else if (health === 1) {
		game.camera.shake(0.05, 300);
	} else {
		game.camera.shake(0.07, 350);
	}
}

function playerVSbadlaser(player, laser) {
	laser.kill();
	screenShake();
	damagesfx.play();
	health--;
	if (health === 0) {
		player.kill();
		gameoversfx.play();
		game.time.events.add(1500, resetGame, this);
	}
}

function enemyVSlaser(enemy, laser) {
	shotdownsfx.play();
	killcount++;
	enemy.kill();
}

function resetGame() {
	health = 3;
	killcount = 0;
	//console.log(playerLasers);
	playerLasers.callAll("kill");
	turrets.callAll("kill");
	turretLasers.callAll("kill");
	player.x = game.world.width / 2;
	player.y = game.world.height / 2;
	player.revive();
}

});
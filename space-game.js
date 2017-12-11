require(["audio-manager"], function(){

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
var badLaserSpeed = 600;
var turretSpeed = 200;

var playerLasers;
var badLasers;
var turrets;

function preload() {
	//images
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
	
	//init graphics engine
	graphics = game.add.graphics();
	
	//add player lasers
	playerLasers = game.add.group();
    playerLasers.enableBody = true;
    playerLasers.physicsBodyType = Phaser.Physics.ARCADE;

    playerLasers.createMultiple(50, "BLUE BEAM");
    playerLasers.setAll("checkWorldBounds", true);
    playerLasers.setAll("outOfBoundsKill", true);
	
	//add enemy lasers
	badLasers = game.add.group();
    badLasers.enableBody = true;
    badLasers.physicsBodyType = Phaser.Physics.ARCADE;

    badLasers.createMultiple(50, "RED BEAM");
    badLasers.setAll("checkWorldBounds", true);
    badLasers.setAll("outOfBoundsKill", true);
	
	//turret enemies
	turrets = game.add.group();
	turrets.enableBody = true;
	turrets.physicsBodyType = Phaser.Physics.ARCADE;
	turrets.createMultiple(50, "TURRET");
	turrets.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//add player
	player = game.add.sprite(game.world.width/2, game.world.height/2, "TRIANGLE");
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player);
	player.body.maxVelocity = {x: SPEED, y: SPEED};
	
	//turret timer
	timer = game.time.create(false);
	timer.loop(1000, spawnTurret, this);
	timer.loop(1000, function() {turrets.forEachAlive(turretFire, this);});
	timer.start();
	
	//init audio
	loadAudio(game);
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 0, "( - )", style);
}

function update() {
	//collision
	game.physics.arcade.overlap(turrets, playerLasers, turretVSlaser, null, this);
	game.physics.arcade.overlap(player, badLasers, playerVSbadlaser, null, this);
	
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
		graphics.lineTo(game.input.mousePointer.x, game.input.mousePointer.y);
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

function turretFire(turret) {
	//checking to make sure the turret exists prevents a strange bug
	if (turret) {
		var laser = badLasers.getFirstDead();
		laser.reset(turret.x, turret.y);
		laser.rotation = turret.rotation;
		game.physics.arcade.moveToXY(laser, player.x, player.y, badLaserSpeed);
		shootsfx.play();
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

function spawnTurret() {
	if (turrets.countDead() > 0) {
		var side = random.between(0,3);
		var x;
		var y;
		if (side === 0) {
			//left
			x = -50;
			y = random.between(0, game.world.height);
		} else if (side === 1) {
			//top
			x = random.between(0, game.world.width);
			y = -50
		} else if (side === 2) {
			//right
			x = game.world.width + 50;
			y = random.between(0, game.world.height);
		} else if (side === 3) {
			//bottom
			x = random.between(0, game.world.width);
			y = game.world.height + 50;
		}
		var turret = turrets.getFirstDead();
		turret.reset(x, y);
		angleTowardsPlayer(turret);
		game.physics.arcade.moveToXY(turret, player.x, player.y, turretSpeed);
		turretFire(turret);
	}
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

function turretVSlaser(turret, laser) {
	shotdownsfx.play();
	killcount++;
	turret.kill();
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

function resetGame() {
	health = 3;
	killcount = 0;
	//console.log(playerLasers);
	playerLasers.callAll("kill");
	turrets.callAll("kill");
	badLasers.callAll("kill");
	player.x = game.world.width / 2;
	player.y = game.world.height / 2;
	player.revive();
}

});
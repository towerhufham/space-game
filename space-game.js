// require("requirejs");
var game = new Phaser.Game(1200, 800, Phaser.CANVAS, "phaser-example", { preload: preload, create: create, update: update });

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
var enemyParticles;

var MAPX = 1090;
var MAPY = 10;
var MAPSIZE = 100;


function preload() {
	
	//scripts
	// game.load.script("TURRET SCRIPT", "turret");
	// game.load.script("AUDIO-MANAGER SCRIPT", "audio-manager");
	
	//images
	game.load.image("BACKGROUND", "img/tempbg.jpg");
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.spritesheet("POLYP", "img/polyp_thing.png", 32, 32, 4);
	game.load.image("TURRET", "img/turret.png");
	game.load.image("BLUE BEAM", "img/beam.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	game.load.image("PARTICLE", "img/particle.png");
	game.load.image("ENERGY", "img/energy.png");
	
	//audio
	preloadAudio(game);
}

function create() {
	//init random
	random = game.rnd;
	
	//size the world
	game.world.setBounds(0, 0, 3840, 3840);
	
	//add background
	game.add.tileSprite(0, 0, 3840, 3840, "BACKGROUND");
	
	//init graphics objects
	aim = game.add.graphics();
	map = game.add.graphics();
	map.fixedToCamera = true;
	
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
	// game.camera.follow(player);
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	player.body.collideWorldBounds = true;
	
	//load turrets
	loadTurrets(game, player);
	
	//add polyps
	loadPolyps(game);
	
	//enemy particles
	enemyParticles = game.add.emitter(0, 0, 50);
	enemyParticles.makeParticles("PARTICLE");
	// enemyParticles.setAlpha(0, 0.5, 500, Phaser.Easing.Linear.None, 1);
	enemyParticles.setAlpha(0.75, 0, 1500);
	enemyParticles.gravity = 0;
	
	//init audio
	loadAudio(game);
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 0, "( - )", style);
	debugText.fixedToCamera = true;
	
	//fullscreen stuff
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
	var f11 = game.input.keyboard.addKey(Phaser.Keyboard.F11);
	f11.onDown.add(toggleFullscreen, this);
	//default to fullscreen
	game.scale.startFullScreen(false);
	setMapPosition();
}

function update() {
	//collision
	game.physics.arcade.overlap(turrets, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(polyps, playerLasers, polypVSlaser, null, this);
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
	
	//draw map
	setMapPosition(); //i don't like doing this every frame, but since the fullscreen calls are asynchronus it's the easiest way to do it
	drawMap();
	
	//enemies aim
	turrets.forEachAlive(angleTowardsPlayer, this);
	
	//score
	debugText.text = "Score: " + killcount;
}

function setMapPosition() {
	MAPX = game.scale.width - 110;
}

function drawPlayerAim() {
	aim.clear(); //clears this graphic object's stuff
	if (player.alive) {
		aim.lineStyle(2, 0xFFFFFF, 0.5);
		aim.moveTo(player.x, player.y);
		aim.lineTo(game.input.mousePointer.worldX, game.input.mousePointer.worldY);
	}
}

function drawMap() {
	//draw bounds
	map.clear();
	map.lineStyle(1, 0xFFFFFF, 0.5);
	map.drawRect(MAPX, MAPY, MAPSIZE, MAPSIZE);
	
	// var rx = game.world.width / player.x;
	// var ry = game.world.height / player.y;
	var rx = player.x / game.world.width;
	var ry = player.y / game.world.height;
	var drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
	var drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
	map.lineStyle(1, 0xFFFFFF, 1);
	map.drawRect(drawx, drawy, 3, 3);
	
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
		//change this to playerParticles when the player sprite is changed
		enemyParticles.x = player.x;
		enemyParticles.y = player.y;
		enemyParticles.start(true, 1000, null, 25);
		player.kill();
		gameoversfx.play();
		game.time.events.add(1500, resetGame, this);
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
	for (var i = 0; i < 5; i++) {
		var e = energies.getFirstDead();
		if (e) {
			e.revive();
			e.x = polyp.x;
			e.y = polyp.y;
			e.body.velocity.x = random.between(100, 400) * random.sign();
			e.body.velocity.y = random.between(100, 400) * random.sign();
			e.body.drag.x = 200;
			e.body.drag.y = 200;
			e.angle = random.angle();
		} else {
			console.log("PROBLEM: no e!");
		}
	}
	//do regular collision stuff
	polypsfx.play();
	polyp.kill();
	laser.kill();
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

function toggleFullscreen() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	} else {
		game.scale.startFullScreen(false);
	}
}
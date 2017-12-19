var game = new Phaser.Game(1200, 800, Phaser.CANVAS, "phaser-example", { preload: preload, create: create, update: update });

var player;
var health = 3;
var killcount = 0;
var currentEnergy = 0;
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
var enemyGroups = [];

var MAPX = 1090;
var MAPY = 10;
var MAPSIZE = 100;

var TESTLEVEL = ["turrets", "octopuses", "lobsters"];

function preload() {
	//images
	game.load.image("BACKGROUND", "img/tempbg.jpg");
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.spritesheet("POLYP", "img/polyp_thing.png", 32, 32, 4);
	game.load.image("TURRET", "img/turret.png");
	game.load.image("BLUE BEAM", "img/beam.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	game.load.image("PARTICLE", "img/particle.png");
	game.load.image("ENERGY", "img/energy.png");
	game.load.image("ENERGY PARTICLE", "img/energy_ring.png");
	game.load.image("PLACEHOLDER", "img/placeholder.png");
	game.load.image("OCTO-CLOSED", "img/octo_closed.png");
	game.load.image("OCTO-OPEN", "img/octo_open.png");
	
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
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	player.body.collideWorldBounds = true;
	
	//load enemie lasers
	loadEnemyLasers(game);
	
	//add polyps
	loadPolyps(game);
	
	//load level enemies
	loadLevel(TESTLEVEL);
	// loadTurrets(game, player);
	// loadOctopuses(game, player);
	
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
	game.physics.arcade.overlap(octopuses, playerLasers, enemyVSlaser, null, this);
	game.physics.arcade.overlap(polyps, playerLasers, polypVSlaser, null, this);
	game.physics.arcade.overlap(player, enemyLasers, playerVSbadlaser, null, this);
	game.physics.arcade.overlap(player, energies, playerVSenergy, null, this);
	
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
	
	//close game
	if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
		//todo: make it open up menu
		window.close();
	}
	
	//magnet energies
	magnetEnergies(game, player);
	
	//draw aim
	drawPlayerAim();
	
	//draw map
	setMapPosition(); //i don't like doing this every frame, but since the fullscreen calls are asynchronus it's the easiest way to do it
	drawMap();
	
	//enemies aim
	//todo: make this less hacky
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].forEachAlive(angleTowardsPlayer, this);
		enemyGroups[i].forEachAlive(angleTowardsPlayer, this);
	}
	
	//debug text
	debugText.text = "Kills: " + killcount + "\nEnergy: " + currentEnergy;
}

function loadLevel(levelAttributes) {
	if (levelAttributes.includes("turrets")) {
		enemyGroups.push(loadTurrets(game, player));
	} if (levelAttributes.includes("octopuses")) {
		enemyGroups.push(loadOctopuses(game, player));
	} if (levelAttributes.includes("lobsters")) {
		enemyGroups.push(loadLobsters(game, player));
	}
	console.log("current enemy groups:");
	console.log(enemyGroups);
	spawnPolyps();
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
	
	//draw player box
	var rx = player.x / game.world.width;
	var ry = player.y / game.world.height;
	var drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
	var drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
	map.lineStyle(1, 0xFFFFFF, 1);
	map.drawRect(drawx, drawy, 3, 3);
	
	//draw polyps
	map.lineStyle(1, 0xFF00FF, 1);
	polyps.forEachAlive(function(polyp){
		rx = polyp.x / game.world.width;
		ry = polyp.y / game.world.height;
		drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
		drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
		map.drawRect(drawx, drawy, 3, 3);
	}, this);
	
	//draw energies
	map.lineStyle(1, 0xFFFF00, 1);
	energies.forEachAlive(function(e){
		rx = e.x / game.world.width;
		ry = e.y / game.world.height;
		drawx = Math.round(rx * MAPSIZE) + MAPX;
		drawy = Math.round(ry * MAPSIZE) + MAPY;
		map.drawRect(drawx, drawy, 1, 1);
	}, this);
	
	//draw enemies
	map.lineStyle(1, 0xFF0000, 1);
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].forEachAlive(function(e){
			rx = e.x / game.world.width;
			ry = e.y / game.world.height;
			drawx = Math.round(rx * MAPSIZE) + MAPX;
			drawy = Math.round(ry * MAPSIZE) + MAPY;
			map.drawRect(drawx, drawy, 1, 1);
		}, this);
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
}

function resetGame() {
	//reset global vars
	health = 3;
	killcount = 0;
	currentEnergy = 0;
	//kill all lasers
	playerLasers.callAll("kill");
	enemyLasers.callAll("kill");
	//kill all enemies
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].clearFunc();
	}
	//clear enemy groups
	enemyGroups = [];
	//destroy polyps & energies
	polyps.callAll("kill");
	energies.callAll("kill");
	//reset player
	player.body.stop();
	player.x = game.world.width / 2;
	player.y = game.world.height / 2;
	player.revive();
	//reload level
	loadLevel(TESTLEVEL);
}

function toggleFullscreen() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	} else {
		game.scale.startFullScreen(false);
	}
}
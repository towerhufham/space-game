var game = new Phaser.Game(1200, 800, Phaser.CANVAS, "phaser-example", { preload: preload, create: create, update: update });

var gate;
var player;
var invincible = false;
var health = 4;
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
var playerLaserSpeed = 800;
var playerLasers;
var enemyParticles;
var enemyGroups = [];
var currentLevel = 1;
var screenIsShaking = false;
var pad1;

function preload() {
	//images
	game.load.image("BACKGROUND", "img/tempbg.jpg");
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.image("POLYP", "img/polyp_thing.png");
	game.load.image("TURRET", "img/turret.png");
	game.load.image("BLUE BEAM", "img/beam.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	game.load.image("PARTICLE", "img/particle.png");
	game.load.image("ENERGY", "img/energy2.png");
	game.load.image("ENERGY PARTICLE", "img/energy_ring2.png");
	game.load.image("REFLECTOR", "img/reflector.png");
	game.load.image("PLACEHOLDER", "img/placeholder.png");
	game.load.image("BLADE", "img/blades.png");
	game.load.image("EXPLODER", "img/exploder.png");
	game.load.image("EXPLOSION", "img/explosion.png");
	game.load.image("DEBRIS", "img/debris.png");
	game.load.image("GRENADER", "img/grenader.png");
	game.load.image("GRENADE", "img/grenade.png");
	game.load.image("FURNACE", "img/furnace.png");
	game.load.image("SLIDER", "img/slider.png");
	game.load.spritesheet("OCTO", "img/octo.png", 61, 64);
	game.load.spritesheet("GATE", "img/gate.png", 64, 49);
	
	//ui
	game.load.spritesheet("HEARTS", "img/ui/hearts.png", 80, 74);
	game.load.spritesheet("ENERGY-CELL", "img/ui/energy_cells.png", 25, 25);
	game.load.spritesheet("ROUND-CELL", "img/ui/round_cells.png", 25, 25);
	
	//tilesets
	// game.load.image("TILES-SCRAPYARD", "img/tiles/tiles_debug.png");
	game.load.image("TILES-SCRAPYARD", "img/tiles/tiles_scrapyard.png");
	game.load.image("TILES-FOUNDRY", "img/tiles/tiles_foundry.png");
	
	//audio
	preloadAudio(game);
	
	//this allows us to use an fps counter
	game.time.advancedTiming = true;
}

function create() {
	//init random
	random = game.rnd;
	
	//size the world
	game.world.setBounds(0, 0, 3840, 3840);
	
	//add background
	// game.add.tileSprite(0, 0, 3840, 3840, "BACKGROUND");
	
	//add gate
	gate = game.add.sprite(0, 0, "GATE", 0);
	gate.anchor.setTo(0.5, 0.5);
	gate.open = false;
	
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
	player.canMagnet = true;
	// makePhantom(player, "PLACEHOLDER");
	
	//load enemy lasers
	loadEnemyLasers(game);
	
	//add polyps
	loadPolyps(game);
	
	//load level enemies
	loadLevel();
	
	//enemy particles
	enemyParticles = game.add.emitter(0, 0, 50);
	enemyParticles.makeParticles("PARTICLE");
	enemyParticles.setAlpha(0.75, 0, 1500);
	enemyParticles.gravity = 0;
	
	//init audio
	loadAudio(game);
	
	//ui
	loadUi();
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 130, "( - )", style);
	debugText.fixedToCamera = true;
	
	//fullscreen stuff
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
	var f11 = game.input.keyboard.addKey(Phaser.Keyboard.F11);
	f11.onDown.add(toggleFullscreen, this);
	//default to fullscreen
	game.scale.startFullScreen(false);
	setMapPosition();
	
	//debug
	var f10 = game.input.keyboard.addKey(Phaser.Keyboard.F10);
	f10.onDown.add(debugFunc, this);
	
	//godmode
	var f9 = game.input.keyboard.addKey(Phaser.Keyboard.F9);
	f9.onDown.add(function(){invincible = !invincible; energysfx.play(); console.log("godmode = " + invincible);}, this);
	
	//gamepad
	game.input.gamepad.start();
    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    pad1 = game.input.gamepad.pad1;
}

function update() {
	// collision detection
	doCollisions();
	
	//angle
	player.rotation = game.physics.arcade.angleToPointer(player);
	
	//player phantom
	// player.phantom.x = player.x;
	// player.phantom.y = player.y;
	
	//horizontal velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
		player.body.velocity.x -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
		player.body.velocity.x += ACCEL;
	} else {
		player.body.velocity.x += Math.sign(player.body.velocity.x) * -DEACCEL;
	}
	//stop sliding
	if (player.body.velocity.x < 5 && player.body.velocity.x > -5) {
		player.body.velocity.x = 0;
	}
	
	//vertical velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {
		player.body.velocity.y -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)) {
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
	
	//update enemies
	for (var i = 0; i < enemyGroups.length; i++) {
		if (typeof enemyGroups[i].extraUpdate === "function") {
			enemyGroups[i].extraUpdate();
		} else {
			console.log("WARNING: an extraUpdate was found to not be callable");
		}
	}
	
	//FOR NOW
	if (sliders) {
		sliders.forEachAlive(updateSlider, this);
	}
	
	//debug text
	debugText.text = "Level: " + currentLevel + "\nFPS: " + game.time.fps;
}

function loadLevel() {
	var levelAttributes = getLevelFeatures(currentLevel);
	var eList = levelAttributes.enemies;
	
	if (eList.includes("turrets")) {
		enemyGroups.push(loadTurrets(game, player));
	} if (eList.includes("octopuses")) {
		enemyGroups.push(loadOctopuses(game, player));
	} if (eList.includes("lobsters")) {
		enemyGroups.push(loadLobsters(game, player));
	}
	
	//if tiles currently exist, destroy them
	if (tileLayer != null) {
		tileLayer.destroy();
	}
	//close gate
	closeGate();
	//add tiles
	tileLayer = makeTiles(game, levelAttributes.map);
	console.log(tileLayer.polypMap);
	spawnPolyps(tileLayer.polypMap);
	gate.x = tileLayer.gatePosition.x;
	gate.y = tileLayer.gatePosition.y;
	//clear out stuff that needs clearing out
	
	//optional features
	if (tileLayer.reflectorMap) {
		loadReflectors(game);
		spawnReflectors(tileLayer.reflectorMap);
	}
	if (tileLayer.bladeMap) {
		loadBlades(game);
		spawnBlades(tileLayer.bladeMap);
	}
	if (tileLayer.exploderMap) {
		loadExploders(game);
		spawnExploders(tileLayer.exploderMap);
	}
	if (tileLayer.grenaderMap) {
		loadGrenaders(game);
		spawnGrenaders(tileLayer.grenaderMap);
	}
	if (tileLayer.furnaceMap) {
		loadFurnaces(game);
		spawnFurnaces(tileLayer.furnaceMap);
	}
	if (tileLayer.sliderMap) {
		loadSliders(game);
		spawnSliders(tileLayer.sliderMap);
	}
}

function getLevelFeatures(level) {
	if (level === 1) {
		// return {enemies:["turrets"], map:"scrapyard"};
		return {enemies:["turrets"], map:"foundry"};
	} else if (level === 2) {
		return {enemies:["turrets", "octopuses"], map:"scrapyard"};
	} else if (level === 3) {
		return {enemies:["octopuses"], map:"foundry"};
	} else {
		return {enemies:[], map:"scrapyard"};
	}
}

function drawPlayerAim() {
	aim.clear(); //clears this graphic object's stuff
	if (player.alive) {
		aim.lineStyle(2, 0xFFFFFF, 0.5);
		aim.moveTo(player.x, player.y);
		aim.lineTo(game.input.mousePointer.worldX, game.input.mousePointer.worldY);
	}
}

function damagePlayer() {
	if (!invincible) {
		health--;
		screenShake();
		damagesfx.play();
		updateHpBar();
		if (health === 0) {
			//change this to playerParticles when the player sprite is changed
			enemyParticles.x = player.x;
			enemyParticles.y = player.y;
			enemyParticles.start(true, 1000, null, 25);
			player.kill();
			gameoversfx.play();
			game.time.events.add(1500, resetGame, this);
		} else {
			//i-frames
			flashSprite(player, 1000);
			invincible = true;
			game.time.events.add(1000, function(){invincible = false;}, this);
		}
	}
}

function playerFire() {
	if (game.time.now > nextFire && playerLasers.countDead() > 0 && player.alive === true) {
		nextFire = game.time.now + fireRate;
		var laser = playerLasers.getFirstDead();
		laser.reset(player.x, player.y);
		laser.angle = player.angle;
		game.physics.arcade.moveToPointer(laser, playerLaserSpeed);
    }
}

//this as of right now is only used by reflectors to "reflect" a player's laser
function playerFireAtAngle(game, source, angle, speed = _defaultSpeed) {
	//in radians
	var laser = playerLasers.getFirstDead();
	if (laser) {
		laser.reset(source.x, source.y);
		laser.rotation = angle
		laser.body.velocity.setToPolar(angle, speed);
	}
}

function screenShake() {
	if (!screenIsShaking) {
		screenIsShaking = true;
		game.camera.shake(0.0075, 250);
		game.time.events.add(250, function(){screenIsShaking = false;}, this);
	}
}

function openGate() {
	gate.open = true;
	gate.animations.frame = 1;
	gatesfx.play();
	screenShake();
}

function closeGate() {
	gate.open = false;
	gate.animations.frame = 0;
}

function resetGame() {
	//reset global vars
	health = 4;
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
	//destroy all auxillary objects
	if (reflectors) {
		reflectors.callAll("kill");
	}
	if (blades) {
		blades.callAll("kill");
	}
	if (exploders) {
		exploders.callAll("kill");
	}
	if (grenaders) {
		grenaders.callAll("kill");
	}
	if (grenades) {
		grenades.callAll("kill");
	}
	if (furnaces) {
		furnaces.callAll("kill");
	}
	if (blobs) {
		blobs.callAll("kill");
	}
	if (sliders) {
		sliders.callAll("kill");
	}
	//reset player
	player.body.stop();
	player.x = game.world.width / 2;
	player.y = game.world.height / 2;
	player.revive();
	//reload level
	loadLevel();
	//reload ui
	reloadUi();
}

function toggleFullscreen() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	} else {
		game.scale.startFullScreen(false);
	}
}

function flashSprite(sprite, time, tint = 0x000000) {
	var timer = game.time.create(false);
	var tinted = false;
	timer.loop(75, function(){
		if (tinted) {
			sprite.tint = 0xFFFFFF;
			tinted = false;
		} else {
			sprite.tint = tint;
			tinted = true;
		}
	}, this);
	game.time.events.add(time, function(){timer.stop(); sprite.tint = 0xFFFFFF;}, this);
	timer.start();
}

function debugFunc() {
	polyps.forEachAlive(function(polyp){
		console.log("polyp at (" + polyp.x + "," + polyp.y + ")");
	}, this);
}
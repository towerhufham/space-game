var game = new Phaser.Game(1200, 800, Phaser.CANVAS, "", {preload: preload, create: create, update: update});
// var game = new Phaser.Game(1200, 800, Phaser.CANVAS, "", {preload: preload, create: create, update: update, render: render});

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
// var currentLevel = 4;
var screenIsShaking = false;
var pad1;
var currentEnemies = 0;
var MAX_ENEMIES = 10;
var zodiacLevel = false;
var EXIT_FRAMES = 0;
var exitText;
var AT_MENU = true;

function preload() {
	//images
	game.load.image("BACKGROUND", "img/tempbg.jpg");
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.image("BULLSHIP", "img/bullship.png");
	game.load.image("POLYP", "img/polyp_thing.png");
	game.load.image("TURRET", "img/turret.png");
	game.load.image("CYAN BEAM", "img/beam.png");
	game.load.image("MAGENTA BEAM", "img/beam_mag.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	game.load.image("GREEN BEAM", "img/beam_green.png");
	game.load.image("PARTICLE", "img/particle.png");
	game.load.image("ENERGY", "img/energy2.png");
	game.load.image("ENERGY PARTICLE", "img/energy_ring2.png");
	game.load.image("REFLECTOR", "img/reflector.png");
	game.load.image("PLACEHOLDER", "img/placeholder.png");
	game.load.image("BLADE", "img/blades.png");
	game.load.image("EXPLODER", "img/exploder.png");
	game.load.image("EXPLOSION-MAGENTA", "img/explosion.png");
	game.load.image("EXPLOSION-RED", "img/explosion_red.png");
	game.load.image("EXPLOSION-GREEN", "img/explosion_green.png");
	game.load.image("EXPLOSION", "img/explosion.png");
	game.load.image("DEBRIS", "img/debris.png");
	game.load.image("GRENADER", "img/grenader.png");
	game.load.image("GRENADE", "img/grenade.png");
	game.load.image("FURNACE", "img/furnace.png");
	game.load.image("SLIDER", "img/slider.png");
	game.load.image("BLOB", "img/blob.png");
	game.load.image("CRAB", "img/crab.png");
	game.load.image("GRASS", "img/grass.png");
	game.load.image("BLADE-OF-GRASS", "img/bladeofgrass.png");
	game.load.image("LOGO", "img/templogo.png");
	
	//spritesheets
	game.load.spritesheet("OCTO", "img/octo.png", 61, 64);
	game.load.spritesheet("GATE", "img/gate.png", 64, 49);
	
	//ui
	game.load.image("PORTRAIT-BG", "img/portraits/bg.png");
	game.load.image("PORTRAIT1", "img/portraits/R-Wave.png");
	game.load.image("PORTRAIT2", "img/portraits/L-Type.png");
	game.load.image("PORTRAIT3", "img/portraits/A-Star.png");
	game.load.image("PORTRAIT4", "img/portraits/C-Like.png");
	game.load.spritesheet("HEARTS", "img/ui/hearts.png", 80, 74);
	game.load.spritesheet("ENERGY-CELL", "img/ui/energy_cells.png", 25, 25);
	game.load.spritesheet("ROUND-CELL", "img/ui/round_cells.png", 25, 25);
	
	//zodiac
	preloadZodiac();
	
	//tilesets
	// game.load.image("TILES-SCRAPYARD", "img/tiles/tiles_debug.png");
	game.load.image("TILES-SCRAPYARD", "img/tiles/tiles_scrapyard.png");
	game.load.image("TILES-FOUNDRY", "img/tiles/tiles_foundry.png");
	game.load.image("TILES-BIOLAB", "img/tiles/tiles_biolab.png");
	
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
	
	//add gate
	gate = game.add.sprite(0, 0, "GATE", 0);
	gate.anchor.setTo(0.5, 0.5);
	gate.open = false;
	
	//init graphics objects
	aim = game.add.graphics();
	map = game.add.graphics();
	map.fixedToCamera = true;
	
	//load zodiac powerups
	loadZodiac();
	
	//add player lasers
	playerLasers = game.add.group();
    playerLasers.enableBody = true;
    playerLasers.physicsBodyType = Phaser.Physics.ARCADE;
    playerLasers.createMultiple(50, "CYAN BEAM");
    playerLasers.setAll("checkWorldBounds", true);
    playerLasers.setAll("outOfBoundsKill", true);
	playerLasers.callAll("anchor.setTo", "anchor", 1, 0.5);
    playerLasers.callAll("body.setSize", "body", 5, 5, 30, 0);
	
	//add player
	player = game.add.sprite(game.world.width/2, game.world.height/2, "BULLSHIP");
	// player = game.add.sprite(game.world.width/2, game.world.height/2, "TRIANGLE");
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player);
	player.body.maxVelocity = {x: SPEED, y: SPEED};
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	player.body.collideWorldBounds = true;
	player.canMagnet = true;
	player.body.setSize(20, 20, 14, 6);
	makePhantom(player, "BULLSHIP");
	
	//load enemy lasers
	loadEnemyLasers(game);
	
	//add polyps
	loadPolyps(game);
	
	//enemy particles
	enemyParticles = game.add.emitter(0, 0, 50);
	enemyParticles.makeParticles("PARTICLE");
	enemyParticles.setAlpha(0.75, 0, 1500);
	enemyParticles.gravity = 0;
	
	//init audio
	loadAudio(game);
	
	//ui
	loadUi();
	
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
	
	//load level
	loadLevel();
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 175, "( - )", style);
	debugText.fixedToCamera = true;
	
	//add exit text
	exitText = game.add.text(600, 400, "Exiting...", {font: "64px Arial", fill:"#FFFFFF", stroke:"#000000", strokeThickness:"10", align:"center"});
	exitText.alpha = 0;
	exitText.fixedToCamera = true;
	
	//startup menu
	startupMenu();
}

function update() {
	//check for player trying to exit
	if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
		EXIT_FRAMES++;
		if (EXIT_FRAMES >= 100) {
			window.close();
		}
	} else {
		EXIT_FRAMES = 0;
	}
	exitText.alpha = EXIT_FRAMES / 100;
	
	if (AT_MENU) {
		if (atOptions) {
			optionMenuUpdate();
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			loadOptionsMenu();
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			AT_MENU = false;
			game.add.tween(background).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
			game.add.tween(logo).to({alpha: 0}, 1000, Phaser.Easing.Exponential.Out, true);
		}
	} else {
		// collision detection
		doCollisions();
		
		//angle
		player.rotation = game.physics.arcade.angleToPointer(player);
		
		//player phantom
		// player.phantom.x = player.x;
		// player.phantom.y = player.y;
		
		//aries makes the player faster while they aren't firing
		if (ARIES && !game.input.activePointer.leftButton.isDown) {
			SPEED = 550;
			player.body.maxVelocity = {x: SPEED, y: SPEED};
		} else if (SPEED == 550) {
			//change back to default when the above params are no longer true
			SPEED = 400;
			player.body.maxVelocity = {x: SPEED, y: SPEED};
		}
		
		//horizontal velocity
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
			player.body.velocity.x -= ACCEL;
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
			player.body.velocity.x += ACCEL;
		} else {
			//pisces makes the player stop easier
			player.body.velocity.x += Math.sign(player.body.velocity.x) * -DEACCEL * (PISCES ? 2 : 1);
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
			//pisces makes the player stop easier
			player.body.velocity.y += Math.sign(player.body.velocity.y) * -DEACCEL * (PISCES ? 2 : 1);
		}
		//stop sliding
		if (player.body.velocity.y < 5 && player.body.velocity.y > -5) {
			player.body.velocity.y = 0;
		}
		
		//fire
		if (game.input.activePointer.leftButton.isDown) {
			playerFire();
		}
		
		//magnet energies
		magnetEnergies(game, player);
		
		//magnet zodiac
		magnetZodiac();
		
		//draw aim
		drawPlayerAim();
		
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
		debugText.text = "Level: " + currentLevel + "\nFPS: " + game.time.fps + "\nCurrent Enemies: " + currentEnemies;
		
		//draw map
		setMapPosition(); //i don't like doing this every frame, but since the fullscreen calls are asynchronus it's the easiest way to do it
		drawMap();
	}
}

function render() {
	//debug hitboxes
	//player
	game.debug.body(player);
	//player lasers
	playerLasers.forEachAlive(game.debug.body, game.debug);
	//enemy lasers
	enemyLasers.forEachAlive(game.debug.body, game.debug);
	//enemies
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].forEachAlive(game.debug.body, game.debug);
	}
}

function resetGame() {
	//reset global vars
	health = 4;
	killcount = 0;
	currentEnergy = 0;
	//libra starts the player with 5 energy
	if (LIBRA) {
		currentEnergy = 5;
	}
	currentEnemies = 0;
	//kill all lasers
	playerLasers.callAll("kill");
	enemyLasers.callAll("kill");
	//kill all enemies
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].clearFunc();
	}
	//clear enemy groups
	enemyGroups = [];
	//destroy polyps & energies, then reloads
	polyps.destroy();
	energies.destroy();
	energyParticles.destroy();
	stopEnergyPing();
	loadPolyps(game);
	//destroy all auxillary objects
	if (reflectors) {
		reflectors.destroy();
	}
	if (blades) {
		blades.destroy();
	}
	if (exploders) {
		exploders.destroy();
	}
	if (grenaders) {
		grenaders.destroy();
	}
	if (grenades) {
		grenades.destroy();
	}
	if (furnaces) {
		furnaces.destroy();
	}
	if (blobs) {
		blobs.destroy();
	}
	if (sliders) {
		sliders.destroy();
	}
	if (grass) {
		grass.destroy();
		grassParticles.destroy();
	}
	//reset player
	player.body.stop();
	player.revive();
	player.x = game.world.width / 2;
	player.y = game.world.height / 2;
	//load level
	loadLevel();
}

function loadLevel() {
	var levelAttributes = getLevelFeatures(currentLevel);
	var eList = levelAttributes.enemies;
	
	if (eList) {
		if (eList.includes("turrets")) {
			enemyGroups.push(loadTurrets(game, player, levelAttributes.turretRate));
		} 
		if (eList.includes("octopuses")) {
			enemyGroups.push(loadOctopuses(game, player, levelAttributes.octopusRate));
		}
		if (eList.includes("crabs")) {
			enemyGroups.push(loadCrabs(game, player, levelAttributes.crabRate));
		}
		// if (eList.includes("lobsters")) {
		//	enemyGroups.push(loadLobsters(game, player));
		// }
	}
	
	//if tiles currently exist, destroy them
	if (tileLayer != null) {
		tileLayer.destroy();
	}
	//close gate
	closeGate();
	//add tiles
	tileLayer = makeTiles(game, levelAttributes.map, levelAttributes.params);
	// console.log(tileLayer.polypMap);
	spawnPolyps(tileLayer.polypMap);
	gate.x = tileLayer.gatePosition.x;
	gate.y = tileLayer.gatePosition.y;
	//clear out stuff that needs clearing out
	
	//optional features
	if (tileLayer.reflectorMap) {
		loadReflectors(game, tileLayer.reflectorMap.length);
		spawnReflectors(tileLayer.reflectorMap);
	}
	if (tileLayer.bladeMap) {
		loadBlades(game, tileLayer.bladeMap.length);
		spawnBlades(tileLayer.bladeMap);
	}
	if (tileLayer.exploderMap) {
		loadExploders(game, tileLayer.exploderMap.length);
		spawnExploders(tileLayer.exploderMap);
	}
	if (tileLayer.grenaderMap) {
		loadGrenaders(game, tileLayer.grenaderMap.length);
		spawnGrenaders(tileLayer.grenaderMap);
	}
	if (tileLayer.furnaceMap) {
		loadFurnaces(game, tileLayer.furnaceMap.length);
		spawnFurnaces(tileLayer.furnaceMap);
	}
	if (tileLayer.sliderMap) {
		loadSliders(game, tileLayer.sliderMap.length);
		spawnSliders(tileLayer.sliderMap);
	}
	if (tileLayer.grassMap) {
		loadGrass(game, tileLayer.grassMap.length);
		spawnGrass(tileLayer.grassMap);
	}
	//load ui last so it's on top of other objects
	reloadUi();
	
	if (levelAttributes.zodiacDrop) {
		game.time.events.add(500, function(){dropAlert(strings["zodiac-level"]);}, this);
		zodiacLevel = true;
	} else {
		zodiacLevel = false;
	}
}

function getLevelFeatures(level) {
	if (level === 1) {
		//basic first level
		setLaserColor("MAGENTA BEAM");
		explosionColor = "EXPLOSION-MAGENTA";
		return {enemies:["turrets"], turretRate:3000, map:"scrapyard"};
	} else if (level === 2) {
		//slightly harder second level
		return {enemies:["turrets", "octopuses"], turretRate:4000, octopusRate:4000, map:"scrapyard", zodiacDrop:true};
	} else if (level === 3) {
		//blade-y third level
		return {enemies:["turrets", "octopuses"], turretRate:4000, octopusRate:4000, map:"scrapyard", params:[1, 0.12, 0.9, 0.15, 0.01], zodiacDrop:true};
	} else if (level === 4) {
		//first level has no enemies, so the player can understand how to move around the foundry
		setLaserColor("RED BEAM");
		explosionColor = "EXPLOSION-RED";
		return {map:"foundry"};
	} else if (level === 5) {
		//second level the player is ambushed by the CRABZ
		return {enemies:["crabs"], crabRate:2200, map:"foundry", zodiacDrop:true};
	} else if (level === 6) {
		//harder third level
		return {enemies:["crabs"], crabRate:2200, map:"foundry"};
	} else if (level === 7) {
		//biolab
		setLaserColor("GREEN BEAM");
		explosionColor = "EXPLOSION-GREEN";
		return {enemies:["octopuses"], octopusRate:1500, map:"biolab"};
	} else {
		currentLevel = "You made it bro";
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
		//virgo sometimes blocks damage
		if (VIRGO && Math.random() > 0.75) {
			virgosfx.play();
			var itime = 1000;
			if (CAPRICORN) {
				itime = 2500;
			}
			flashSprite(player, itime);
			invincible = true;
			game.time.events.add(itime, function(){invincible = false;}, this);
		} else {
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
				game.time.events.add(1500, function(){//reload level
					currentLevel = 1;
					resetGame();
					//re-startup
					startupMenu();
				}, this);
			} else {
				//i-frames
				var itime = 1000;
				if (CAPRICORN) {
					itime = 2500;
				}
				flashSprite(player, itime);
				invincible = true;
				game.time.events.add(itime, function(){invincible = false;}, this);
				//cancer gives bullet explosion when player is damaged
				if (CANCER) {
					for (var i = 0; i < 20; i++) {
						var angle = game.rnd.angle() * (Math.PI / 180);
						playerFireAtAngle(game, player, angle);
					}
					reflectorsfx.play();
				}
			}
		}
	}
}

function playerFire() {
	if (game.time.now > nextFire && playerLasers.countDead() > 0 && player.alive === true) {
		//gemini gives double fire
		if (GEMINI) {
			//aquarius gives faster bullet rate
			if (AQUARIUS) {
				nextFire = game.time.now + 70;
			} else {
				nextFire = game.time.now + fireRate;
			}
			playerFireAtAngle(game, player, player.rotation - 0.05);
			playerFireAtAngle(game, player, player.rotation + 0.05);
		} else {
			//aquarius gives faster bullet rate
			if (AQUARIUS) {
				nextFire = game.time.now + 70;
			} else {
				nextFire = game.time.now + fireRate;
			}
			var laser = playerLasers.getFirstDead();
			laser.reset(player.x, player.y);
			laser.angle = player.angle;
			//sagittarius gives faster bullet speed
			if (SAGITTARIUS) {
				game.physics.arcade.moveToPointer(laser, 1400);
			} else {
				game.physics.arcade.moveToPointer(laser, playerLaserSpeed);
			}
		}
		//scorpio gives backwards-shots
		if (SCORPIO) {
			playerFireAtAngle(game, player, player.rotation + Math.PI);
		}
    }
}

//this as of right now is only used by weird stuff
function playerFireAtAngle(game, source, angle, speed = playerLaserSpeed) {
	//in radians
	var laser = playerLasers.getFirstDead();
	if (laser) {
		laser.reset(source.x, source.y);
		laser.rotation = angle
		//Sagittarius gives faster bullet speed
		if (SAGITTARIUS) {
			laser.body.velocity.setToPolar(angle, 1400);
		} else {
			laser.body.velocity.setToPolar(angle, speed);
		}
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
	// polyps.forEachAlive(function(polyp){
		// console.log("polyp at (" + polyp.x + "," + polyp.y + ")");
	// }, this);
	openGate();
}
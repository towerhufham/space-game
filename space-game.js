var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var player;
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

var shootsfx;

function preload() {
	//images
	game.load.image("TRIANGLE", "img/triangle.png");
	game.load.image("TURRET", "img/turret.png");
	game.load.image("BLUE BEAM", "img/beam.png");
	game.load.image("RED BEAM", "img/beam_red.png");
	
	//audio
	game.load.audio("SHOOT", "audio/shooty_low.wav");
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
	player = game.add.sprite(400, 300 , "TRIANGLE");
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player);
	player.body.maxVelocity = {x: SPEED, y: SPEED};
	
	//turret timer
	timer = game.time.create(false);
	timer.loop(1000, spawnTurret, this);
	timer.start();
	
	//init audio
	shootsfx = game.add.audio("SHOOT", 0.25);
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 0, "( - )", style);
}

function update() {
	//collision
	game.physics.arcade.overlap(playerLasers, turrets, turretVSlaser, null, this);
	
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
	
	debugText.text = player.body.velocity.x + "," + player.body.velocity.y;
}

function drawPlayerAim() {
	graphics.clear(); //clears this graphic object's stuff
	graphics.lineStyle(2, 0xFFFFFF, 0.5);
	graphics.moveTo(player.x, player.y);
	graphics.lineTo(game.input.mousePointer.x, game.input.mousePointer.y);
}

function playerFire() {
	if (game.time.now > nextFire && playerLasers.countDead() > 0) {
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
	var laser = badLasers.getFirstDead();
	laser.reset(turret.x, turret.y);
	laser.rotation = turret.rotation;
	game.physics.arcade.moveToXY(laser, player.x, player.y, badLaserSpeed);
	shootsfx.play();
}

function spawnTurret() {
	var x = random.between(0, game.world.width);
	var y = random.between(0, game.world.height);
	if (turrets.countDead() > 0) {
		var turret = turrets.getFirstDead();
		turret.reset(x, y);
		turret.rotation = game.physics.arcade.angleToXY(turret, player.x, player.y);
		turretFire(turret);
	}
}

function turretVSlaser(laser, turret) {
	turret.kill();
}
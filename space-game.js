var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var player;
var graphics;
var debugText;
var ACCEL = 20;
var SPEED = 400;
var DEACCEL = 20;

function preload() {
	game.load.image("TRIANGLE", "img/triangle.png");
}

function create() {
	//init graphics engine
	graphics = game.add.graphics();
	
	//add player
	player = game.add.sprite(400, 300 , "TRIANGLE");
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player);
	player.body.maxVelocity = {x: SPEED, y: SPEED};
	
	//add debug text
	var style = {font: "32px Arial", fill:"#FFFFFF", align:"left"};
	debugText = game.add.text(0, 0, "( - )", style);
}

function update() {
	//angle
	player.rotation = game.physics.arcade.angleToPointer(player);
	
	//horizontal velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		player.body.velocity.x -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		player.body.velocity.x += ACCEL;
	} else {
		player.body.velocity.x += Math.sign(player.body.velocity.x) * -DEACCEL;
	}
	//stop sliding
	if (player.body.velocity.x < 5 && player.body.velocity.x > -5) {
		player.body.velocity.x = 0;
	}
	
	//vertical velocity
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		player.body.velocity.y -= ACCEL;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		player.body.velocity.y += ACCEL;
	} else {
		player.body.velocity.y += Math.sign(player.body.velocity.y) * -DEACCEL;
	}
	//stop sliding
	if (player.body.velocity.y < 5 && player.body.velocity.y > -5) {
		player.body.velocity.y = 0;
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
	var bullet = game.add.sprite(player.x, player.y, "TRIANGLE");
	//todo: look at this https://phaser.io/examples/v2/arcade-physics/shoot-the-pointer
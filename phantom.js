var PHANTOM_RATE = 0.5;
var PHANTOM_TIME = 500;

function makePhantom(parent, key) {
	var phantomTimer = game.time.create(false);
	phantomTimer.loop(PHANTOM_RATE, function(){
		var phantom = game.add.sprite(parent.x, parent.y, key);
		phantom.anchor.setTo(0.5, 0.5);
		phantom.angle = player.angle;
		game.add.tween(phantom).to({alpha:0}, PHANTOM_TIME, Phaser.Easing.Exponential.Out, true);
		game.time.events.add(PHANTOM_TIME, function(){phantom.destroy();}, this);
	}, this);
	phantomTimer.start();
	parent.phantomTimer = phantomTimer;
}	

function clearPhantom(parent) {
	parent.phantomTimer.destroy();
}
var sliders;
var SLIDER_ACCEL = 5;

function loadSliders(game) {
	//load sliders
	sliders = game.add.group();
	sliders.enableBody = true;
	sliders.physicsBodyType = Phaser.Physics.ARCADE;
	sliders.createMultiple(25, "SLIDER");
	sliders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
}

function spawnSliders(m) {
	for (var i = 0; i < m.length; i++) {
		var e = sliders.getFirstDead();
		if (e) {
			e.revive();
			e.x = m[i].x;
			e.y = m[i].y;
		}
	}
}

function updateSlider(sli) {
	//vertical
	if (Math.abs(player.x - sli.x) < 48) {
		//up or down
		if (player.y < sli.y) {
			sli.body.velocity.y -= SLIDER_ACCEL;
		} else {
			sli.body.velocity.y += SLIDER_ACCEL;
		}
		sli.body.velocity.x = 0;
	}
	//horizontal
	if (Math.abs(player.y - sli.y) < 48) {
		//left or right
		if (player.x < sli.x) {
			sli.body.velocity.x -= SLIDER_ACCEL;
		} else {
			sli.body.velocity.x += SLIDER_ACCEL;
		}
		sli.body.velocity.y = 0;
	}
}
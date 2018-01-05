var sliders;
var SLIDER_SPEED = 80;
var SLIDER_ACCEL = 1.08;
var SLIDER_MAX_SPEED = 1000;

function loadSliders(game) {
	//load sliders
	sliders = game.add.group();
	sliders.enableBody = true;
	sliders.physicsBodyType = Phaser.Physics.ARCADE;
	sliders.createMultiple(25, "SLIDER");
	sliders.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	sliders.setAll("body.collideWorldBounds", true);
	sliders.setAll("body.maxVelocity.x", SLIDER_MAX_SPEED);
	sliders.setAll("body.maxVelocity.y", SLIDER_MAX_SPEED);
	sliders.forEach(function(sli){sli.isSliding=false;},this);
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
	//start moving
	if (!sli.isSliding) {
		//vertical
		if (Math.abs(player.x - sli.x) < 48) {
			//up or down
			if (player.y < sli.y) {
				sli.body.velocity.y = -SLIDER_SPEED;
			} else {
				sli.body.velocity.y = SLIDER_SPEED;
			}
			sli.body.velocity.x = 0;
			sli.isSliding = true;
		}
		//horizontal
		else if (Math.abs(player.y - sli.y) < 48) {
			//left or right
			if (player.x < sli.x) {
				sli.body.velocity.x = -SLIDER_SPEED;
			} else {
				sli.body.velocity.x = SLIDER_SPEED;
			}
			sli.body.velocity.y = 0;
			sli.isSliding = true;
		}
	} 
	//increase speed
	else {
		if (sli.body.velocity.x != 0) {
			//play sound if started moving
			if (Math.abs(sli.body.velocity.x) === SLIDER_SPEED * SLIDER_ACCEL) {
				slidersfx.play();
			}
			sli.body.velocity.x *= SLIDER_ACCEL;
		}
		if (sli.body.velocity.y != 0) {
			//play sound if started moving
			if (Math.abs(sli.body.velocity.y) === SLIDER_SPEED * SLIDER_ACCEL) {
				slidersfx.play();
			}
			sli.body.velocity.y *= SLIDER_ACCEL;
		}
	}
}

function sliderCollision(sli) {
	sli.isSliding = false;
}
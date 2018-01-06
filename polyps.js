var polyps;
var energies;
var energyParticles;

function loadPolyps(game) {
	//load polyps
	polyps = game.add.group();
	polyps.enableBody = true;
	polyps.physicsBodyType = Phaser.Physics.ARCADE;
	polyps.createMultiple(4, "POLYP");
	polyps.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	polyps.setAll("body.immovable", true);
	
	//load energy particles
	energyParticles = game.add.emitter(0, 0, 4*5);
	energyParticles.makeParticles("ENERGY PARTICLE");
	energyParticles.setAlpha(1, 0, 1500);
	energyParticles.setScale(0.1, 1, 0.1, 1, 1500);
	energyParticles.setRotation(0, 0);
	energyParticles.setXSpeed(0, 0);
	energyParticles.setYSpeed(0, 0);
	energyParticles.gravity = 0;
	// energyParticles.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	
	//load energy
	energies = game.add.group();
	energies.enableBody = true;
	energies.physicsBodyType = Phaser.Physics.ARCADE;
	energies.createMultiple(4*5, "ENERGY");
	energies.callAll("body.enableBody", true);
	energies.setAll("body.collideWorldBounds", true);
	energies.setAll("body.worldBounce", new Phaser.Point(1, 1));
	
	//energy ping timer
	timer = game.time.create(false);
	timer.loop(2000, pingEnergies, this);
	timer.start();
}

// function spawnPolyps() {
	// polyps.reviveAll();
	// polyps.scatter(new Phaser.Rectangle(32, 32, 3840-32, 3840-32), true); //these numbers are the world bounds with margin of 32
// }

function spawnPolyps(polypMap) {
	for (var i = 0; i < polypMap.length; i++) {
		var p = polyps.getFirstDead();
		p.revive();
		p.x = polypMap[i].x;
		p.y = polypMap[i].y;
		// console.log("placed polyp at (" + p.x + "," + p.y + ")");
	}
}

function polypShockwave(p) {
	var shockwave = game.add.sprite(p.x, p.y, "ENERGY PARTICLE");
	shockwave.anchor.setTo(0.5, 0.5);
	shockwave.scale.setTo(0.1, 0.1);
	shockwave.alpha = 1;
	game.add.tween(shockwave.scale).to({x:2, y:2}, 500, Phaser.Easing.Sinusoidal.Out, true);
	game.add.tween(shockwave).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
	
	//if the player is near, bounce them back
	if (Phaser.Math.distance(shockwave.x, shockwave.y, player.x, player.y) <= 140*1.5) {
		var rad = game.physics.arcade.angleBetween(shockwave, player);
		var x = Math.cos(rad) * 10000;
		var y = Math.sin(rad) * 10000;
		// console.log(x, y);
		player.body.velocity.x = x;
		player.body.velocity.y = y;
		player.canMagnet = false;
		game.time.events.add(500, function(){player.canMagnet = true;}, this);
	}
}

function spawnEnergies(polyp) {
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
			e.anchor.setTo(0.5, 0.5);
		} else {
			console.log("PROBLEM: no e!");
		}
	}
}

function pingEnergies() {
	energies.forEachAlive(function(e){
		energyParticles.x = e.x;
		energyParticles.y = e.y;
		energyParticles.start(true, 1500, null, 1);
	}, this);
}

function magnetEnergies(game, player) {
	if (player.canMagnet) {
		energies.forEachAlive(function(e){
			var dist = Phaser.Math.distance(e.x, e.y, player.x, player.y);
			if (dist < 125) {
				var angle = game.physics.arcade.angleBetween(e, player);
				angle *= Phaser.Math.RAD_TO_DEG;  //why tf does phaser use two different angle notations without converting automatically
				var vel = game.physics.arcade.velocityFromAngle(angle, 450);
				e.body.velocity = vel;
			}
		}, this);
	}
}
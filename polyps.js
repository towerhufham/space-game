var polyps;
var energies;
var energyParticles;

function loadPolyps(game) {
	//load polyps
	polyps = game.add.group();
	polyps.enableBody = true;
	polyps.physicsBodyType = Phaser.Physics.ARCADE;
	polyps.createMultiple(4, "POLYP");
	polyps.reviveAll();
	polyps.callAll("animations.add", "animations", "idle", null, 8, true);
	polyps.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	polyps.scatter(Phaser.Rectangle(32, 32, 3840-32, 3840-32), true); //these numbers are the world bounds with margin of 32
	
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
	
	//energy ping timer
	timer = game.time.create(false);
	timer.loop(2000, pingEnergies, this);
	timer.start();
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
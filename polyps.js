var polyps;

function loadPolyps(game) {
	polyps = game.add.group();
	polyps.enableBody = true;
	polyps.physicsBodyType = Phaser.Physics.ARCADE;
	polyps.createMultiple(4, "POLYP");
	polyps.reviveAll();
	polyps.callAll("animations.add", "animations", "idle", null, 8, true);
	polyps.callAll("anchor.setTo", "anchor", 0.5, 0.5);
	polyps.scatter(Phaser.Rectangle(32, 32, 3840-32, 3840-32), true); //these numbers are the world bounds with margin of 32
}
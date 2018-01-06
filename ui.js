var portrait;
var hpBar = {};
var energyBar = {};
var MAPX = 1090;
var MAPY = 10;
var MAPSIZE = 100;

//for now
var portraitKey = "PORTRAIT" + (Math.floor(Math.random() * (4 - 1 + 1)) + 1);

function loadUi() {
	//portrait background
	portraitbg = game.add.sprite(0, 0, "PORTRAIT-BG");
	portraitbg.fixedToCamera = true;
	//portrait
	portrait = game.add.sprite(0, 0, portraitKey);
	portrait.fixedToCamera = true;
	var offset = 170;
	
	//hp
	hpBar[1] = game.add.sprite(0+offset, 0, "HEARTS", 0);
	hpBar[1].fixedToCamera = true;
	hpBar[2] = game.add.sprite(90+offset, 0, "HEARTS", 0);
	hpBar[2].fixedToCamera = true;
	hpBar[3] = game.add.sprite(90*2+offset, 0, "HEARTS", 0);
	hpBar[3].fixedToCamera = true;
	hpBar[4] = game.add.sprite(90*3+offset, 0, "HEARTS", 0);
	hpBar[4].fixedToCamera = true;
	
	//energy
	for (var i = 0; i < 19; i++) {
		energyBar[i+1] = game.add.sprite(i*20+offset, 75, "ENERGY-CELL", 0);
		energyBar[i+1].fixedToCamera = true;
	}
	energyBar[20] = game.add.sprite(385+offset, 75, "ROUND-CELL", 0);
	energyBar[20].fixedToCamera = true;
	
	//make sure they show correct values
	updateHpBar();
	updateEnergyBar();
}

function reloadUi() {
	//null the stuff (not sure this works tbh)
	portrait = null;
	hpBar = {};
	energyBar = {};
	//reload
	loadUi();
}

function updateHpBar() {
	for (var i = 1; i < 5; i++) {
		if (i <= health) {
			hpBar[i].animations.frame = 0;
		} else {
			hpBar[i].animations.frame = 1;
		}
	}
}

function updateEnergyBar() {
	//main cells
	for (var i = 1; i < 20; i++) {
		if (i > currentEnergy) {
			energyBar[i].animations.frame = 0;
		} else if (currentEnergy < 20) {
			energyBar[i].animations.frame = 1;
		} else {
			energyBar[i].animations.frame = 2;
		}
	}
	//round cells
	if (currentEnergy < 20) {
		energyBar[20].animations.frame = 0;
	} else {
		energyBar[20].animations.frame = 1;
	}
}

function setMapPosition() {
	MAPX = game.scale.width - 110;
}

function drawMap() {
	//init
	map.clear();
	
	//draw bounds & background
	map.beginFill(0x000000, 0.9);
	map.lineStyle(1, 0xFFFFFF, 0.5);
	map.drawRect(MAPX, MAPY, MAPSIZE, MAPSIZE);
	map.endFill();
	
	//draw player box
	var rx = player.x / game.world.width;
	var ry = player.y / game.world.height;
	var drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
	var drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
	map.lineStyle(1, 0xFFFFFF, 1);
	map.drawRect(drawx, drawy, 3, 3);
	
	//draw polyps
	map.lineStyle(1, 0x00FFFF, 1);
	polyps.forEachAlive(function(polyp){
		rx = polyp.x / game.world.width;
		ry = polyp.y / game.world.height;
		drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
		drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
		map.drawRect(drawx, drawy, 3, 3);
	}, this);
	
	//draw energies
	map.lineStyle(1, 0x00FFFF, 1);
	energies.forEachAlive(function(e){
		rx = e.x / game.world.width;
		ry = e.y / game.world.height;
		drawx = Math.round(rx * MAPSIZE) + MAPX;
		drawy = Math.round(ry * MAPSIZE) + MAPY;
		map.drawRect(drawx, drawy, 1, 1);
	}, this);
	
	//draw enemies
	map.lineStyle(1, 0xFF00FF, 1);
	for (var i = 0; i < enemyGroups.length; i++) {
		enemyGroups[i].forEachAlive(function(e){
			if (!e.outOfBounds) {
				rx = e.x / game.world.width;
				ry = e.y / game.world.height;
				drawx = Math.round(rx * MAPSIZE) + MAPX;
				drawy = Math.round(ry * MAPSIZE) + MAPY;
				map.drawRect(drawx, drawy, 1, 1);
			}
		}, this);
	}
	
	//draw gate
	var rx = gate.x / game.world.width;
	var ry = gate.y / game.world.height;
	var drawx = Math.round(rx * MAPSIZE) + MAPX - 1;
	var drawy = Math.round(ry * MAPSIZE) + MAPY - 1;
	map.lineStyle(1, 0x00FF00, 1);
	map.drawRect(drawx, drawy, 3, 3);
	
	//render on top of other sprites
	game.world.bringToTop(map);
}

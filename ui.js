var hpBar = {};
var energyBar = {};

function loadUi() {
	//hp
	hpBar[1] = game.add.sprite(0, 0, "HEARTS", 0);
	hpBar[1].fixedToCamera = true;
	hpBar[2] = game.add.sprite(90, 0, "HEARTS", 0);
	hpBar[2].fixedToCamera = true;
	hpBar[3] = game.add.sprite(90*2, 0, "HEARTS", 0);
	hpBar[3].fixedToCamera = true;
	hpBar[4] = game.add.sprite(90*3, 0, "HEARTS", 0);
	hpBar[4].fixedToCamera = true;
	
	//energy
	for (var i = 0; i < 19; i++) {
		energyBar[i+1] = game.add.sprite(i*20, 75, "ENERGY-CELL", 0);
		energyBar[i+1].fixedToCamera = true;
	}
	energyBar[20] = game.add.sprite(385, 75, "ROUND-CELL", 0);
	energyBar[20].fixedToCamera = true;
	
	//make sure they show correct values
	updateHpBar();
	updateEnergyBar();
}

function reloadUi() {
	hpBar = {};
	energyBar = {};
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
var atOptions = false;
var recentlyPressed = false;
var optionSelector = 0;
var totalOptions = 2;

function changeOption(change) {
	if (!recentlyPressed) {
		optionSelector = Math.abs((optionSelector + change) % totalOptions);
		recentlyPressed = true;
		console.log("selected option is " + optionSelector);
	}
}

function loadOptionsMenu() {
	console.log("at options menu");
	atOptions = true;
}

function optionMenuUpdate() {
	
	//handle input
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
		changeOption(1);
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
		changeOption(-1);
	} else {
		recentlyPressed = false;
	}
	
	//register selection
	if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		if (!recentlyPressed) {
			// 0 is back
			if (optionSelector === 0) {
				atOptions = false;
			}
		}
	}
	
}
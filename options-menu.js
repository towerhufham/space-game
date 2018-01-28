var atOptions = false;
var recentlyPressed = false;
var optionSelector = 0;
var totalOptions = 4;
var recentlyClosed = false;

var menuObjects = [];
var options = {};

function loadOptionsMenu() {
	console.log("at options menu");
	atOptions = true;
	recentlyPressed = true;
	
	var optionsBG = game.add.tileSprite(0, 0, 3840, 3840, "BACKGROUND");
	menuObjects.push(optionsBG);
	
	var backText = game.add.text(600, 100, "Back", {font: "64px Arial", fill:"#FFFFFF", stroke:"#000000", strokeThickness:"10", align:"center"});
	backText.fixedToCamera = true;
	menuObjects.push(backText);
	options[0] = backText;
	
	var portraitText = game.add.text(600, 300, "Change Portrait", {font: "64px Arial", fill:"#FFFFFF", stroke:"#000000", strokeThickness:"10", align:"center"});
	portraitText.fixedToCamera = true;
	menuObjects.push(portraitText);
	options[1] = portraitText;
	
	var sfxText = game.add.text(600, 500, "Sound effects: On", {font: "64px Arial", fill:"#FFFFFF", stroke:"#000000", strokeThickness:"10", align:"center"});
	sfxText.fixedToCamera = true;
	menuObjects.push(sfxText);
	options[2] = sfxText;
	
	var musicText = game.add.text(600, 700, "Music: On", {font: "64px Arial", fill:"#FFFFFF", stroke:"#000000", strokeThickness:"10", align:"center"});
	musicText.fixedToCamera = true;
	menuObjects.push(musicText);
	options[3] = musicText;
	
	drawPortrait();
	
	optionSelector = 0;
	options[optionSelector].fill = "#00FFFF";
}

function unloadOptionsMenu() {
	for (var i = 0; i < menuObjects.length; i++) {
		menuObjects[i].destroy();
	}
	options = {};
	portrait.destroy();
	portraitbg.destroy();
}

function changeOption(change) {
	if (!recentlyPressed) {
		//de-highlight last selected option
		options[optionSelector].fill = "#FFFFFF";
		//calculate new selection
		optionSelector = Math.abs((optionSelector + change) % totalOptions);
		//set debounce flag
		recentlyPressed = true;
		//highlight
		options[optionSelector].fill = "#00FFFF";
	}
}

function optionMenuUpdate() {
	
	//handle input
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
		changeOption(1);
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
		changeOption(-1);
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		if (!recentlyPressed) {
			// 0 is back
			if (optionSelector === 0) {
				unloadOptionsMenu();
				atOptions = false;
				recentlyClosed = true;
			}
			// 1 is change portrait
			else if (optionSelector === 1) {
				if (portraitId < 4) {
					portraitId++;
				} else {
					portraitId = 1;
				}
				console.log("portrait id changed to " + portraitId);
				setCookie("portraitId", portraitId);
				drawPortrait();
			}
			// 2 is mute sfx
			else if (optionSelector === 2) {
				if (game.sound.mute) {
					game.sound.mute = false;
					options[2].text = "Sound effects: On";
				} else {
					game.sound.mute = true;
					options[2].text = "Sound effects: Off";
				}
			}
			// 3 is mute music
			else if (optionSelector === 3) {
				//mute music
			}
			recentlyPressed = true;
		}
	} else {
		recentlyPressed = false;
	}
}
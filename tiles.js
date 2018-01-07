var tilemap;
var tileLayer;

function _makeLevelArray(width=3840, height=3840, tileSize=64) {
	var tilesWide = width / tileSize;
	var tilesHigh = height / tileSize;
	var arr = [];
	for (var i=0; i < tilesHigh; i++) {
		arr.push([]);
		for (var j=0; j < tilesWide; j++) {
			arr[i].push(" ");
		}
	}
	return arr;
}

function _placePolyps(game, arr, size=60) {
	//spawn polyps
	//top-left
	var x = game.rnd.between(0, (size/2)-1);
	var y = game.rnd.between(0, (size/2)-1);
	arr[x][y] = "P";
	//top-right
	var x = game.rnd.between(30, size-1);
	var y = game.rnd.between(0, (size/2)-1);
	arr[x][y] = "P";
	//bottom-left
	var x = game.rnd.between(0, (size/2)-1);
	var y = game.rnd.between(30, size-1);
	arr[x][y] = "P";
	//bottom-right
	var x = game.rnd.between(30, size-1);
	var y = game.rnd.between(30, size-1);
	arr[x][y] = "P";
	
	return arr;
}

function _placeGate(game, arr) {
	var x = game.rnd.between(0, 60-1);
	var y = game.rnd.between(0, 60-1);
	while (arr[x][y] != " ") {
		var x = game.rnd.between(0, 60-1);
		var y = game.rnd.between(0, 60-1);
	}
	arr[x][y] = "G";
	return arr;
}

function _tileArrayQualityInsurance(arr) {
	//ensure the spawn area is empty
	arr[29][29] = " ";
	arr[29][30] = " ";
	arr[30][29] = " ";
	arr[30][30] = " ";
	return arr;
}

function designScrapyard(game, steps=1, tileLevel=0.12, bladeLevel=0.1, exploderLevel=0.15, reflectorLevel=0.01) {
	//init
	var arr = _makeLevelArray();
	
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType("tile", {
		getBlock: function () {
			if (!this.alive) {
				return " ";
			} else if (this.isBlades) {
				return "b";
			} else if (this.isExploder) {
				return "e";
			} else if (this.isReflector) {
				return "r";
			} else {
				return "w";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, "wasAlive");
			this.alive = (surrounding === 3 || surrounding < 2 && this.alive);
			this.isBlades = (surrounding === 1 && this.alive && Math.random() > 1-bladeLevel);
			this.isExploder = (!this.isBlades && surrounding > 2 && Math.random() > 1-exploderLevel);
			this.isReflector = (surrounding === 0 && Math.random() > 1-reflectorLevel);
			if (this.isExploder || this.isReflector) {this.alive = true;}
			if (!this.isBlades && !this.isExploder && !this.isReflector && surrounding === 0) {this.alive = false;}
		},
		reset: function () {
			this.wasAlive = this.alive;
		}
	}, function () {
		//init
		this.alive = Math.random() > 1-tileLevel;
	});
	
	world.initialize([
		{name: "tile", distribution: 100},
	]);
	
	//update world
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	//convert world to tile array
	for (var y=0; y<world.height; y++) {
		for (var x=0; x<world.width; x++) {
			var cell = world.grid[x][y];
			arr[x][y] = cell.getBlock()
		}
	}
	//place polyps
	arr = _placePolyps(game, arr);
	arr = _placeGate(game, arr);
	return arr;
}

function designFoundry(game, steps=15, tileLevel=0.001, furnaceLevel=0.025, sliderLevel=0.05) {
	//init
	var arr = _makeLevelArray();
	
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			if (!this.alive) {
				return " ";
			} else if (this.isFurnace) {
				// return "g";
				return "f";
			} else if (this.isSlider) {
				return "s";
			} else {
				return "w";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = (surrounding === 1 || surrounding === 5 && !this.alive) || (surrounding < 3 && this.alive);
			if ((this.alive && surrounding === 5) || (this.alive && surrounding < 2 &&  Math.random() > 1-furnaceLevel)) {this.isFurnace = true;}
			//finalize
			if (world.ticks === steps-1) {
				if (!this.alive && surrounding === 0 && Math.random() > 1-sliderLevel) {this.alive = false; this.isSlider = true}
			}
		},
		reset: function () {
			this.wasAlive = this.alive;
		}
	}, function () {
		//init
		this.alive = Math.random() > 1-tileLevel;
	});

	world.initialize([
		{ name: 'living', distribution: 100 }
	]);
	
	//update world
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	//convert world to tile array
	for (var y=0; y<world.height; y++) {
		for (var x=0; x<world.width; x++) {
			var cell = world.grid[x][y];
			arr[x][y] = cell.getBlock()
		}
	}
	//place polyps
	arr = _placePolyps(game, arr);
	arr = _placeGate(game, arr);
	return arr;
}

function makeLayer(game, arr, key) {
	var data = "";
	//required objects
	var polypMap = [];
	var gatePosition = null;
	//optional objects
	var reflectorMap = [];
	var bladeMap = [];
	var exploderMap = [];
	var grenaderMap = [];
	var furnaceMap = [];
	var sliderMap = [];
	//go!
	var size = 60; // yaaay hardcoding
	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {
			
			// " " is empty space
			if (arr[x][y] === " ") {
				data += "-1";
			} 
			
			// "w" is a wall
			else if (arr[x][y] === "w") {
				data += "0";
			}
			
			// "P" is polyp
			else if (arr[x][y] === "P") {
				data += "12";
				polypMap.push({x:(x * 64 + 32), y:(y * 64 + 32)}); //moar h4x
			}
			
			// "G" is the gate
			else if (arr[x][y] === "G") {
				data += "13";
				gatePosition = {x:(x * 64 + 32), y:(y * 64 + 32)};
			}
			
			// "b" is blade
			else if (arr[x][y] === "b") {
				data += "-1";
				bladeMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			// "e" is exploder
			else if (arr[x][y] === "e") {
				data += "-1";
				exploderMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			// "r" is reflector
			else if (arr[x][y] === "r") {
				data += "-1";
				reflectorMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			// "g" is reflector
			else if (arr[x][y] === "g") {
				data += "-1";
				grenaderMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			// "f" is reflector
			else if (arr[x][y] === "f") {
				data += "-1";
				furnaceMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			// "s" is reflector
			else if (arr[x][y] === "s") {
				data += "-1";
				sliderMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
			}
			
			//end of line
			if (x < size-1) {
				data += ",";
			}
		}
		if (y < size-1) {
			data += "\n";
		}
	}
	// Add data to the cache
    game.cache.addTilemap("dynamicMap", null, data, Phaser.Tilemap.CSV);
    // Create our map (64 is tilesize)
    tilemap = game.add.tilemap("dynamicMap", 64, 64);
    // "tiles" = cache image key,
    tilemap.addTilesetImage("tiles", key, 64, 64);
	//collision
	tilemap.setCollision(0);
	// 0 is the layer index
    layer = tilemap.createLayer(0);
	//this makes the layer render on every portion of the window (needed because the game.width/height is different depending on fullscreen)
	//i doubt this is how this method is supposed to be used, but it works so
	layer.resize(3840, 3840);
	//give the layer a map of the polyps and position of gate
	layer.polypMap = polypMap;
	layer.gatePosition = gatePosition;
	layer.reflectorMap = reflectorMap;
	layer.bladeMap = bladeMap;
	layer.exploderMap = exploderMap;
	layer.grenaderMap = grenaderMap;
	layer.furnaceMap = furnaceMap;
	layer.sliderMap = sliderMap;
	//return the layer for collision
	return layer;
}
	
function makeTiles(game, generationName, genParams) {
	//lookup generationName
	var key;
	var designFunc;
	if (generationName === "scrapyard") {
		key = "TILES-SCRAPYARD";
		if (genParams) {
			//game, steps=1, tileLevel=0.12, bladeLevel=0.1, exploderLevel=0.15, reflectorLevel=0.01
			designFunc = function() {return designScrapyard(game, genParams[0], genParams[1], genParams[2], genParams[3], genParams[4]);};
		} else {
			designFunc = designScrapyard;
		}
	} else if (generationName === "foundry") {
		key = "TILES-FOUNDRY";
		if (genParams) {
			//game, steps=15, tileLevel=0.001, furnaceLevel=0.05, sliderLevel=0.05
			designFunc = function() {return designFoundry(game, genParams[0], genParams[1], genParams[2], genParams[3]);};
		} else {
			designFunc = designFoundry;
		}
	}
	// var design = designScrapyard(game);
	var design = designFunc(game);
	//quality insurance
	design = _tileArrayQualityInsurance(design);
	//make the layer
	var layer = makeLayer(game, design, key);
	return layer;
}

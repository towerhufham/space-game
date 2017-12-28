var tilemap;

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

/* function designStageCA(game) {

	//init
	var arr = _makeLevelArray();
	
	//create the CA sim (ripped directly from https://sanojian.github.io/cellauto/)
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			return this.alive ? "w" : " ";
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = surrounding === 3 || surrounding === 2 && this.alive;
		},
		reset: function () {
			this.wasAlive = this.alive;
		}
	}, function () {
		//init
		this.alive = Math.random() > 0.8;
	});

	world.initialize([
		{ name: 'living', distribution: 100 }
	]);
	
	//update world
	for (var i = 0; i < 10; i++) {
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
} */

function designScrapyard(game) {

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
			this.isBlades = (surrounding === 1 && this.alive && Math.random() > 0.65);
			this.isExploder = (!this.isBlades && surrounding > 2 && Math.random() > 0.95);
			this.isReflector = (surrounding === 1 && Math.random() > 0.99);
			if (this.isExploder || this.isReflector) {this.alive = true;}
		},
		reset: function () {
			this.wasAlive = this.alive;
		}
	}, function () {
		//init
		this.alive = Math.random() > 0.8775;
	});
	
	world.initialize([
		{name: "tile", distribution: 100},
	]);
	
	//update world
	for (var i = 0; i < 1; i++) {
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
				//act as wall for now
				data += "0";
			}
			
			// "e" is exploder
			else if (arr[x][y] === "e") {
				//act as wall for now
				data += "0";
			}
			
			// "r" is reflector
			else if (arr[x][y] === "r") {
				data += "-1";
				reflectorMap.push({x:(x * 64 + 32), y:(y * 64 + 32)});
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
	//i doubt this is how this method is suppose to be used, but it works so
	layer.resize(3840, 3840);
	//give the layer a map of the polyps and position of gate
	layer.polypMap = polypMap;
	layer.gatePosition = gatePosition;
	layer.reflectorMap = reflectorMap;
	//return the layer for collision
	return layer
}
	
function makeTiles(game, key) {
	// var design = designStage(game);
	var design = designScrapyard(game);
	//quality insurance
	design = _tileArrayQualityInsurance(design);
	//make the layer
	var layer = makeLayer(game, design, key);
	return layer;
}

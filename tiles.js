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

function designStage(game) {
	var arr = _makeLevelArray();
	var size = 60; // #hardcoding ;lool
	// " " is empty space (default)
	// "w" is a wall
	// "P" is polyp
	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {
			//per-tile logic
			if (game.rnd.between(0, 10) === 0) {
				arr[x][y] = "w";
			}
		}
	}
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

function makeLayer(game, arr, key) {
	var data = "";
	var polypMap = [];
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
	//give the layer a map of the polyps
	layer.polypMap = polypMap;
	//return the layer for collision
	return layer
}
	
function makeTiles(game, key) {
	var design = designStage(game);
	var layer = makeLayer(game, design, key);
	return layer;
}

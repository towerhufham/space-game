var tiles;

function makeTiles(game, key, width=3840, height=3840) {
	//tile size is 64x64
	var data = "";
	var tilesWide = width / 64;
	var tilesHigh = height / 64;
	for (var y = 0; y < tilesHigh; y++)
    {
        for (var x = 0; x < tilesWide; x++)
        {
			if (game.rnd.between(0, 50) === 0) {
				data += "0";
			} else {
				data += "-1";
			}

            if (x < 127)
            {
                data += ",";
            }
        }

        if (y < 127)
        {
            data += "\n";
        }
    }
	//  Add data to the cache
    game.cache.addTilemap("dynamicMap", null, data, Phaser.Tilemap.CSV);

    //  Create our map (the 16x16 is the tile size)
    map = game.add.tilemap("dynamicMap", 64, 64);

    //  "tiles" = cache image key, 16x16 = tile size
    map.addTilesetImage("tiles", key, 64, 64);
	
	//collision
	map.setCollision(0);
	
	//  0 is important
    layer = map.createLayer(0);

    //  Scroll it
    // layer.resizeWorld();
	
	//return the layer for collision
	return layer
}
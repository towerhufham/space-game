function gameOfLife(steps) {
	//create the CA sim (ripped directly from https://sanojian.github.io/cellauto/)
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			return this.alive ? "#000000" : "#FFFFFF";
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
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	
	return world;
}

function dirtyCaves(steps) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			return this.alive ? "#000000" : "#FFFFFF";
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = surrounding > 3 || surrounding < 3 && this.alive;
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
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	
	return world;
}

function junkyard(steps) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			return this.alive ? "#000000" : "#FFFFFF";
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = surrounding === 3 || surrounding < 5 && this.alive;
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
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	
	return world;
}

/////////////////////////////////////////

var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
pixel_size = 8

function drawPixel(x, y, color) {
	ctx.fillStyle=color;
	ctx.fillRect(x*pixel_size, y*pixel_size, pixel_size, pixel_size);
}

function render(world) {
	for (var x = 0; x < 60; x++) {
		for (var y = 0; y < 60; y++) {
			drawPixel(x, y, world.grid[x][y].getBlock());
		}
	}
}

////////////////////////////////////////

render(junkyard(10));

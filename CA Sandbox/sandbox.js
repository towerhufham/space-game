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

function scrapyard(steps) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType("tile", {
		getBlock: function () {
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isBlades) {
				return "#FF0000";
			} else if (this.isExploder) {
				return "#FF9900";
			} else if (this.isReflector) {
				return "#42F4E2";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, "wasAlive");
			this.alive = (surrounding === 3 || surrounding < 2 && this.alive);
			this.isBlades = (surrounding === 1 && this.alive && Math.random() > 0.9);
			this.isExploder = (!this.isBlades && surrounding > 2 && Math.random() > 0.95);
			this.isReflector = (surrounding === 0 && Math.random() > 0.99);
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
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	
	return world;
}

function weirdTunnels(steps) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType("tile", {
		getBlock: function () {
			if (!this.alive) {
				return "#FFFFFF";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, "wasAlive");
			this.alive = (surrounding === 0 || surrounding < 2 && this.alive);
		},
		reset: function () {
			this.wasAlive = this.alive;
		}
	}, function () {
		//init
		this.alive = Math.random() > 0.9;
	});
	
	world.initialize([
		{name: "tile", distribution: 100},
	]);
	
	//update world
	for (var i = 0; i < steps; i++) {
		world.step();
	}
	
	return world;
}

function scrapyard2(steps, tileLevel=0.12, bladeLevel=0.1, exploderLevel=0.15, reflectorLevel=0.01) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType("tile", {
		getBlock: function () {
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isBlades) {
				return "#FF0000";
			} else if (this.isExploder) {
				return "#FF9900";
			} else if (this.isReflector) {
				return "#42F4E2";
			} else {
				return "#000000";
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
	return world;
}

function foundry_old(steps=10, tileLevel=0.1) {
	//create the CA sim (ripped directly from https://sanojian.github.io/cellauto/)
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isFire) {
				return "#FF0000";
			} else if (this.isEntrance) {
				return "#888888";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = (surrounding === 3 || surrounding === 4) || surrounding === 2 && this.alive;
			if (!this.alive && surrounding === 7) {this.alive = true; this.isFire = true;}
			// if (this.alive && !this.isFire && Math.random() > 0.99) {this.isEntrance = true;}
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
	
	return world;
}

function biolab(steps=11, tileLevel=0.015) {
	//create the CA sim (ripped directly from https://sanojian.github.io/cellauto/)
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isBio) {
				return "#008800";
			} else if (this.isThing) {
				return "#888888";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = (surrounding === 2 || surrounding === 4) || (surrounding < 2 || surrounding === 4 ) && this.alive;
			if (!this.alive && surrounding > 1) {this.isBio = true;}
			// if (!this.alive && surrounding === 0) {this.isThing = true;}
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
	
	return world;
}

function mygoodblocks(steps=15, tileLevel=0.0005) {
	//create the CA sim (ripped directly from https://sanojian.github.io/cellauto/)
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isBio) {
				return "#008800";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = (surrounding === 1 || surrounding === 5 && !this.alive) || (surrounding < 3 && this.alive);
			// if (!this.alive && surrounding > 1) {this.isBio = true;}
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
	
	return world;
}

function foundry(steps=15, tileLevel=0.001) {
	var world = new CAWorld({
		width: 60,
		height: 60,
	});

	world.registerCellType('living', {
		getBlock: function () {
			//wall is black, open is white
			if (!this.alive) {
				return "#FFFFFF";
			} else if (this.isFire) {
				return "#CC0000";
			} else {
				return "#000000";
			}
		},
		process: function (neighbors) {
			var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
			this.alive = (surrounding === 1 || surrounding === 5 && !this.alive) || (surrounding < 3 && this.alive);
			if ((this.alive && surrounding === 5) || (this.alive && surrounding < 2 &&  Math.random() > 0.95)) {this.isFire = true;}
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

render(foundry());

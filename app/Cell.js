import Vector from './Vector';
import Square from './Square';
import Maths from './Maths';
import Pheromone from './Pheromone';
import Dandelion from './Dandelion';

class Cell extends Square {
	constructor(game, position) {
		super(game, position, 16, 'black');
		this.position = position;
		this.alpha = 0;
		this.direction = new Vector(0, 0);
		this.foodDirection = new Vector(0, 0);
		this.food = null;
		this.nest = null;
		this.tofood = false;
		this.timeToDandelion = 200 + Math.random() * 200;
		this.debug = false;
		this.pheromones = {};
		this.keys = [];
		// this.createPheromone('food');
		// this.createPheromone('danger');
		// this.createPheromone('home');
		this.active = false;
		this.totalIntensity = 0;
		this.shouldUpdate = true;
		this.occupied = 0;
		this.lastOccupied = false;
		this.lastAlpha = 0;
		this.lastFood = 0;
		this.highlighted = false;
		this.monsters = [];
		this.life = 0;
		this.dandelion == null;
		this.deathToAnts = false;
	}

	createPheromone(key) {
		this.pheromones[key] = {
			key,
			list: [],
			lastAlpha: 0,
			intensity: 0,
			alpha: 0,
			colour: 'black',
			rgb: {r: 255, g: 255, b: 255}
		};
		if (key == 'food') {
			this.pheromones[key].colour = 'blue';
			this.pheromones[key].rgb = {r: 255, g: 255, b: 0};
		} else if (key == 'danger') {
			this.pheromones[key].colour = 'orange';
			this.pheromones[key].rgb = {r: 0, g: 128, b: 255};
		} else if (key == 'home') {
			this.pheromones[key].colour = 'black';
			this.pheromones[key].rgb = {r: 255, g: 255, b: 255};
		}
		this.keys = _.without(this.keys, key);
		this.keys.push(key);
	}

	//For 'home' pheromones, we want to keep the currently active one until it goes away.
	//For 'food' pheromones, when it's added, we need to either update one with the same direction or create a new one.
	addPheromone(pheromone) {
		if (!pheromone.stack) {
			if (!this.hasPheromones(pheromone.key)) {
				this.createPheromone(pheromone.key);
				this.pheromones[pheromone.key].list.push(pheromone);
			} if (this.pheromones[pheromone.key].list.length == 0) {
				this.pheromones[pheromone.key].list.push(pheromone);
			} else {
				this.pheromones[pheromone.key].list[0].add(pheromone.intensity);
			}
		} else if (this.pheromones[pheromone.key]) {
			var found = false;

			_.each(this.pheromones[pheromone.key].list, function(p) {
				if (p.direction.x == pheromone.direction.x && p.direction.y == pheromone.direction.y && p.alive) {
					p.add(pheromone.intensity);
					found = true;
				}
			}.bind(this));

			if (!found) {
				this.pheromones[pheromone.key].list.push(pheromone);
			}
		} else {
			this.createPheromone(pheromone.key);
			this.pheromones[pheromone.key].list.push(pheromone);
		}

		this.checkActive();
	}

	setFood(f) {
		this.food = f;
		this.lastFood = f;
		this.checkActive();
	}

	addFood(f) {
		if (this.food == null) {
			this.setFood(f);
		} else {
			this.food += f;
		}
	}

	getPheromoneDirection(key) {
		var pheromones = this.pheromones[key];
		if (typeof(pheromones) === 'undefined') {
			return null;
		} else if (pheromones.list.length == 1) {
			return pheromones.list[0].direction;
		} else if (pheromones.list.length == 0) {
			return null;
		} else {
			var chances = [];
			var totalChance = 0;
			_.each(pheromones.list, function(p) {
				totalChance += p.intensity / this.totalIntensity;
				chances.push({chance: totalChance, pheromone: p});
			}.bind(this));
			var result = Math.random();
			var index = 0;
			var found = null;
			_.each(chances, function(c) {
				if (found == null) {
					if (result < c.chance) {
						found = c.pheromone;
					}
				}
			});
			if (found != null) {
				found.intensity -= 0.01;
				if (found.intensity < 0) {
					found.intensity = 0;
				}
				return found.direction;
			} else {
				return new Vector(
					Math.round((Math.random() - 0.5) * 2), 
					Math.round((Math.random() - 0.5) * 2)
				);
			}
		}

		this.checkActive();
	}

	monsterLeave(monster) {
		this.monsters = _.without(this.monsters, monster);
		// this.unHighlight();
	}

	monsterEnter(monster) {
		// this.highlight();
		this.monsters = _.without(this.monsters, monster);
		this.monsters.push(monster);
	}

	hasEnoughNeighbours(min, max) {
		var neighbours = 0;
		var found = false;
		for (var x = this.position.x-1; x < this.position.x+1; x++) {
			for (var y = this.position.y-1; y < this.position.y+1; y++) {
				if ((x!=this.position.x || y!=this.position.y) && 
					this.game.grid.inRange(x, y) && 
					this.game.grid.cells[x][y].food != null &&
					this.game.grid.cells[x][y].dandelion == null
				) {
					neighbours++;
					if (neighbours > max) {
						found = true;
					}
				}
				if (found) break;
			}
			if (found) break;
		}
		return !found && neighbours >= min;
	}

	neighbouringFoodCount() {
		var neighbours = 0;
		for (var x = this.position.x-1; x < this.position.x+1; x++) {
			for (var y = this.position.y-1; y < this.position.y+1; y++) {
				if ((x!=this.position.x || y!=this.position.y) && 
					this.game.grid.inRange(x, y) && 
					this.game.grid.cells[x][y].food != null
				) {
					neighbours++;
				}
			}
		}
		return neighbours;
	}

	forEachNeighbour(callback) {
		for (var x = this.position.x-1; x < this.position.x+1; x++) {
			for (var y = this.position.y-1; y < this.position.y+1; y++) {
				if ((x!=this.position.x || y!=this.position.y) && 
					this.game.grid.inRange(x, y)
				) {
					callback(this.game.grid.cells[x][y]);
				}
			}
		}
	}

	update() {
		super.update();

		if (this.shouldUpdate) {
			_.each(this.keys, function(key) {
				this.pheromones[key].intensity = 0;
				_.each(this.pheromones[key].list, function(p) {
					p.update();
					this.pheromones[key].intensity+=p.intensity;
				}.bind(this));
				this.pheromones[key].alpha = Maths.clamp(this.pheromones[key].intensity / 6, 0, 0.5);

				this.pheromones[key].list = _.filter(this.pheromones[key].list, function(p) {
					return p.alive;
				});
			}.bind(this));

			if (this.food !== null) {
				if (this.food <= 0) {
					this.food = null;
				}
			}
		} else {
			this.shouldUpdate = true;
		}

		if (this.highlighted) {
			this.alpha = 1;
			this.colour = '#ff0000';
		}

		if (this.game.cleared || this.highlighted) {
			this.shouldRender = true;
		} else {
			if (this.occupied == 0) {
				if (this.lastOccupied || 
					this.food !== this.lastFood
				) {
					this.shouldRender = true;
				} else {
					_.each(this.keys, function(key) {
						if (this.hasPheromones(key)) {
							var p = this.pheromones[key];
							if (Math.abs(p.alpha-p.lastAlpha) > 0.1) {
								p.lastAlpha = p.alpha + 0;
								this.shouldRender = true;
							}
						}
					}.bind(this));
				}
			} else {
				this.shouldRender = false;
			}
		}
		this.lastOccupied = this.occupied > 0;
		this.checkActive();
		if (this.food != null) {
			this.lastFood = this.food;
		}
		this.deathToAnts = false;
	}

	makeDeadly() {
		this.deathToAnts = true;
		this.checkActive();
	}

	highlight() {
		this.highlighted = true;
		this.checkActive();
	}

	unHighlight() {
		this.highlighted = false;
		this.checkActive();
	}

	hasPheromones(key) {
		return this.pheromones[key] && this.pheromones[key].list.length > 0;
	}

	checkActive() {
		if (this.highlighted ||
			this.deathToAnts ||
			this.hasPheromones('home') ||
			this.hasPheromones('food') || 
			this.hasPheromones('danger') || 
			this.food != null
		) {
			if (!this.active) {
				if (this.game.activeCells.indexOf(this) == -1) {
					this.active = true;
					this.game.activeCells.push(this);
				}
			}
		} else {
			this.active = false;
		}

		// if (this.active) {
		// 	this.highlighted = true;
		// } else {
		// 	this.highlighted = false;
		// }
	}

	render(canvas, ctx) {
		if (this.highlighted) {
			this.colour = 'red';
			this.alpha = 1;
			this.size = 16;
			super.render(canvas, ctx);
		} else if (this.food == null) {
			var colour = {
				r: 255,
				g: 255,
				b: 255
			};

			for (var i = 0; i < this.keys.length; i++) {
				var key = this.keys[i];
				if (this.pheromones[key].list.length > 0) {
					var a = this.pheromones[key].alpha;
					colour.r -= this.pheromones[key].rgb.r * a;
					colour.g -= this.pheromones[key].rgb.g * a;
					colour.b -= this.pheromones[key].rgb.b * a;
				}
			}

			this.alpha = 1;
			this.colour = Maths.parseRGB(colour);
			this.size = 16;
			super.render(canvas, ctx);
		} else {
			this.colour = 'green';
			this.alpha = 1;
			this.size = 16 * (this.food / 8);
			super.render(canvas, ctx);
		}
		// if (this.shouldRender && this.game.camera.inBounds(this.position.x, this.position.y, this.size)) {
		// 	this.size = 16;
		// 	for (var i = 0; i < this.keys.length; i++) {
		// 		var key = this.keys[i];
		// 		if (key != 'home' && this.pheromones[key].list.length > 0) {
		// 			this.colour = this.pheromones[key].colour;
		// 			this.alpha = this.pheromones[key].alpha;
		// 			super.render(canvas, ctx, true);
		// 		}
		// 	}
		// }
	}
}

export default Cell;
import Entity from '../Entity';
import Vector from '../Vector';
import Grid from './Grid';
import Audio from '../Audio';
import Pheromone from './Pheromone';
import Square from '../Square';

class Ant extends Square {
	constructor(game, grid, position = new Vector(0, 0), size = 16) {
		super(game, position, size, 'black');
		this.alpha = 1;
		this.waitTime = 12;
		this.timer = 0;
		this.grid = grid;
		this.cell = grid.getCell(this.position);
		this.lastMove = new Vector(0, 0);
		this.food = 0;
		this.life = 100;
		this.spiralMoves = [
			[1, 0],
			[0, -1],
			[-1, 0],
			[-1, 0],
			[0, 1],
			[0, 1],
			[1, 0],
			[1, 0]
		];
		this.spiralMoveIndex = this.spiralMoves.length;

		this.Vector = Vector;

		if (this.game.antFunction != null) {
			this.setFunction(this.game.antFunction);
		}
		this.state = 'idle';
	}

	setFunction(func) {
		this.logic = func.bind(this);
	}

	lookAroundYou(radius, callback) {
		//Just. Look. Around you.
		var maxdist = radius*radius;

		for (var _x = 0; _x < radius*2; _x++) {
			for (var _y = 0; _y < radius*2; _y++) {
				var x = (this.position.x - radius) + _x;
				var y = (this.position.y - radius) + _y;
				var dist = Math.pow(this.position.x-x, 2) + Math.pow(this.position.y-y, 2);

				if (dist < maxdist && this.grid.inRange(x, y)) {
					callback(this.grid.cells[x][y], dist);
				}
			}
		}
	}

	pheromoneCloud(radius, key, intensity, degrade=0.25, stack, max) {
		this.lookAroundYou(radius, function(cell, dist) {
			var direction = new Vector(0, 0);
			if (cell.position.x > this.position.x) {
				direction.x = -1;
			} else if (cell.position.x < this.position.x) {
				direction.x = 1;
			}
			if (cell.position.y > this.position.y) {
				direction.y = -1;
			} else if (cell.position.y < this.position.y) {
				direction.y = 1;
			}
			var p = new Pheromone(this.game, key, intensity, direction, degrade, stack, max);
			cell.addPheromone(p);
			cell.checkActive();
		}.bind(this));
	}

	update() {
		super.update();
	}

	destroy() {
		if (this.grid.inRange(this.position.x, this.position.y)) {
			this.grid.cells[this.position.x][this.position.y].occupied--;
		}
		this.game.shouldRender = true;
		super.destroy();
	}

	//TODO
	checkState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
	}

	getFoodNumber() {
		return 0;
	}

	lookForFood() {
		var cell = this.getCell();
		if (cell == null) {
			return false;
		} else {
			return cell.food != null && cell.food > 0;
		}
	}

	pickUpFood() {
		var cell = this.getCell();
		if (cell == null) {
			return false;
		} else {
			cell.food--;
			this.food++;
			return true;
		}
	}

	move(m) {
		this.lastMove = m;
		if (this.justMoved()) {
			var cell = this.getCell();
			if (cell != null) {
				cell.occupied--;
			}
			this.position = this.position.add(m);
			var cell = this.getCell();
			if (cell != null) {
				cell.occupied++;
			}

			if (this.position.x < this.game.minX || this.game.minX == -1) {
				this.game.minX = this.position.x;
			} else if (this.position.x > this.game.maxX || this.game.maxX == -1) {
				this.game.maxX = this.position.x;
			}

			if (this.position.y < this.game.minY || this.game.minY == -1) {
				this.game.minY = this.position.y;
			} else if (this.position.y > this.game.maxY || this.game.maxY == -1) {
				this.game.maxY = this.position.y;
			}

			this.game.shouldRender = true;
		}
	}

	justMoved() {
		return this.lastMove != null && (this.lastMove.x != 0 || this.lastMove.y != 0);
	}

	moveRandomly() {
		this.move(new Vector(
			Math.round((Math.random() - 0.5) * 2), 
			Math.round((Math.random() - 0.5) * 2)
		));
	}

	getCell() {
		if (this.grid.inRange(this.position.x, this.position.y)) {
			return this.grid.cells[this.position.x][this.position.y];
		} else {
			return null;
		}
	}

	checkPheromones() {
		var cell = this.getCell();
		var pheromones = {};
		if (cell != null) {
			_.each(cell.keys, function(key) {
				if (this.hasPheromones(key)) {
					pheromones[key] = true;
				}
			}.bind(cell));
		}
		return pheromones;
	}

	getPheromoneDirection(type) {
		var cell = this.getCell();
		if (cell == null) {
			return null;
		} else {
			return cell.getPheromoneDirection(type);
		}
	}

	releasePheromone(key, intensity, direction, degrade, stack, max) {
		var cell = this.getCell();
		if (cell != null) {
			var dir = direction.times(1);
			var p = new Pheromone(this.game, key, intensity, dir, degrade, stack, max);
			cell.addPheromone(p);
			return true;
		} else {
			return false;
		}
	}

	atNest() {
		var cell = this.getCell();
		if (cell == null) {
			return false;
		} else {
			return cell.nest;
		}
	}

	depositFood() {
		if (this.food > 0 && this.atNest()) {
			var cell = this.getCell();
			cell.nest.food++;
			this.food--;
			return true;
		} else {
			return false;
		}
	}

	attack() {
		var cell = this.getCell();
		if (cell == null) {
			return false;
		} else {
			cell.monsters[0].attack();
			return true;
		}
	}

	foundMonsters() {
		var cell = this.getCell();
		if (cell == null) {
			return false;
		} else {
			return cell.monsters.length > 0;
		}
	}

	logic() {
		var state = this.checkState();
		if (state == 'idle') {
			this.setState('looking');
		} else if (state == 'looking') {
			if (this.foundMonsters()) {
				this.attack();
				this.pheromoneCloud(8, 'danger', '1', 10, false, 1);
			}
			var pheromones = this.checkPheromones();
			if (pheromones.danger) {
				this.move(this.getPheromoneDirection('danger'));
			} else if (pheromones.food) {
				if (Math.random() < 0.01) {
					this.moveRandomly();
				} else {
					this.move(this.getPheromoneDirection('food'));
				}
			} else {
				this.moveRandomly();
			}

			if (this.justMoved()) {
				this.releasePheromone('home', 0.75, this.lastMove.times(-1), 0.01, false);
				if (this.lookForFood()) {
					this.pickUpFood();
					this.setState('carrying');
				}
			}
		} else if (state == 'carrying') {
			var pheromones = this.checkPheromones();
			if (pheromones.home) {
				this.move(this.getPheromoneDirection('home'));
			}

			if (this.justMoved()) {
				this.releasePheromone('food', 0.75, this.lastMove.times(-1), 0.01, false);
			}

			if (this.atNest()) {
				this.depositFood();
				this.setState('looking');
			}
		}
	}

	setColour() {
		if (this.food > 0) {
			if (this.colour != 'magenta') {
				this.colour = 'magenta';
				this.game.shouldRender = true;
			}
		} else {
			if (this.colour != 'black') {
				this.colour = 'black';
				this.game.shouldRender = true;
			}
		}
	}

	tick() {
		this.lastMove = null;
		this.life-=this.game.delta * this.game.timescale * 0.0001;
		if (this.life <= 0) {
			this.destroy();
		} else if (
			this.grid.inRange(this.position.x, this.position.y) &&
			this.grid.cells[this.position.x][this.position.y].deathToAnts
		) {
			this.grid.cells[this.position.x][this.position.y].deathToAnts = false;
			this.destroy();
		} else {
			this.logic();
		}

		this.setColour();
	}
}

export default Ant;
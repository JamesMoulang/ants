import Cell from './Cell';
import Entity from '../Entity';
import Vector from '../Vector';
import Maths from '../Maths';
import Forager from './Forager';
import Predator from './Predator';

class Grid extends Entity {
	constructor(game, width, height) {
		super(game);
		this.cells = [];
		this.clumpSize = 10;
		this.clumpDistribution = 0.00125;

		for (var x = 0; x < width; x++) {
			this.cells.push([]);
			for (var y = 0; y < height; y++) {
				this.cells[x].push(new Cell(this.game, new Vector(x, y)));
			}
		}

		this.centerX = this.cells.length * 0.5;
		this.centerY = this.cells[0].length * 0.5;

		this.minX = this.centerX + 0;
		this.maxX = this.centerX + 0;
		this.minY = this.centerY + 0;
		this.maxY = this.centerY + 0;

		this.updateBounds(this.centerX-64, this.centerY-64, this.centerX+64, this.centerY+64);

		this.maxDist = Math.pow(this.centerX, 2) + Math.pow(this.centerY, 2);
	}

	updateBounds(minX, minY, maxX, maxY) {
		if (minX < this.minX) this.minX = minX;
		if (minY < this.minY) this.minY = minY;
		if (maxX > this.maxX) this.maxX = maxX;
		if (maxY > this.maxY) this.maxY = maxY;
	}

	populateCell(x, y) {
		var cell = this.cells[x][y];
		var difficulty = (Math.pow(x-this.centerX, 2) + Math.pow(y-this.centerY, 2)) / this.maxDist;

		var clumpDistribution = this.clumpDistribution / Maths.clamp(difficulty, 0.01, 1);
		clumpDistribution = Maths.clamp(clumpDistribution, 0, 0.0125);
		if (Math.random() < clumpDistribution) {
			if (difficulty > 0) {
				cell.setFood(2);
				var clumpSize = this.clumpSize * difficulty;

				for (var _x = x-clumpSize; _x < x+clumpSize; _x++) {
					for (var _y = y-clumpSize; _y < y+clumpSize; _y++) {
						var dist = Math.pow(x - _x, 2) + Math.pow(y - _y, 2);
						if (dist < clumpSize && this.inRange(Math.round(_x), Math.round(_y))) {
							if (Math.random() < 0.5) {
								this.cells[Math.round(_x)][Math.round(_y)].setFood(Math.round(2 + Math.random() * 2));
							}
						}
					}
				}
			}
		}

		if (difficulty > 0.0125) {
			//create a forager.
			if (Math.random() < 0.00025) {
				var monster = new Predator(this.game, this, new Vector(x, y), this.game.monsterCanvas.canvas);
				this.game.monsters.push(monster);
			}
		}
	}

	populate() {
		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				this.populateCell(x, y);
			}
		}

		var objective = this.game.campaign.getCurrentObjective();
		if (objective != null) {
			if (objective.line != null) {
				var startX = Math.floor(this.game.nest.position.x - objective.line);
				var startY = Math.floor(this.game.nest.position.y - objective.line);
				var endX = Math.ceil(this.game.nest.position.x + objective.line);
				var endY = Math.ceil(this.game.nest.position.y + objective.line);

				for (var x = startX; x <= endX; x++) {
					for (var y = startY; y <= endY; y++) {
						var dist = this.game.nest.position.distance(new Vector(x, y));
						if (dist < objective.line) {
							var cell = this.getCell(new Vector(x, y));
							if (cell != null) {
								cell.highlight();
							}
						}
					}
				}
			}
		}
	}

	destroy() {
		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				this.cells[x][y].destroy();
			}
		}
		super.destroy();
	}

	getCell(pos) {
		if (pos.x >= 0 && pos.x < this.cells.length && pos.y >= 0 && pos.y < this.cells[0].length) {
			return this.cells[pos.x][pos.y];
		} else {
			return null;
		}
	}

	bump() {
		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				this.cells[x][y].update();
			}
		}
	}

	inRange(x, y) {
		return (x >= 0 && x < this.cells.length && y >= 0 && y < this.cells[0].length);
	}

	update() {
		
	}

	render(canvas, ctx) {
		
	}
}

export default Grid;
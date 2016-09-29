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
	}

	populate() {
		var centerX = this.cells.length * 0.5;
		var centerY = this.cells[0].length * 0.5;
		var maxDist = Math.pow(centerX, 2) + Math.pow(centerY, 2);

		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				var cell = this.cells[x][y];
				var difficulty = (Math.pow(x-centerX, 2) + Math.pow(y-centerY, 2)) / maxDist;

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
		}
	}

	getCell(pos) {
		return this.cells[pos.x][pos.y];
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
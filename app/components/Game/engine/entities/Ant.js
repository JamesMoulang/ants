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

		// this.walkAudio = Audio.create('tick');
		// this.walkAudio.volume(0.0005);
		// this.findAudio = Audio.create('Gs3');
		// this.findAudio.volume(0.05);
		// this.carryAudio = Audio.create('Cs4');
		// this.carryAudio.volume(0.01);
		// this.followAudio = Audio.create('Ds4');
		// this.followAudio.volume(0.01);
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
		// if (this.alive) {
		// 	this.timer += this.game.delta * this.game.timescale;
		// 	while(this.timer >= this.waitTime) {
		// 		this.timer -= this.waitTime;
		// 		this.tick();
		// 	}	
		// }
	}

	destroy() {
		if (this.grid.inRange(this.position.x, this.position.y)) {
			this.grid.cells[this.position.x][this.position.y].occupied--;
		}
		this.game.shouldRender = true;
		super.destroy();
	}

	tick() {
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
			var move = new Vector(0, 0);

			if (this.food == 0) {
				this.colour = 'black';
				if (this.spiralMoveIndex < this.spiralMoves.length) {
					move.x = this.spiralMoves[this.spiralMoveIndex][0];
					move.y = this.spiralMoves[this.spiralMoveIndex][1];
-
					this.spiralMoveIndex++;
				} else {
					move = new Vector(
						Math.round((Math.random() - 0.5) * 2), 
						Math.round((Math.random() - 0.5) * 2)
					);
				}

				if (this.grid.inRange(this.position.x, this.position.y)) {
					var cell = this.grid.cells[this.position.x][this.position.y];
					if (cell.hasPheromones('danger')) {
						move = cell.getPheromoneDirection('danger');
					} else if (cell.hasPheromones('food')) {
						if (Math.random() > 0.01) {
							move = cell.getPheromoneDirection('food');
						} else {
							move = new Vector(
								Math.round((Math.random() - 0.5) * 2), 
								Math.round((Math.random() - 0.5) * 2)
							);	
						}
					} else {
						// this.walkAudio.play();
					}
				}

				this.position.x += move.x;
				this.position.y += move.y;

				if (this.grid.inRange(this.position.x, this.position.y)) {
					var dir = this.grid.cells[this.position.x][this.position.y].direction;
					if ((move.x != 0 || move.y != 0) && dir.x == 0 && dir.y == 0) {
						var p = new Pheromone(this.game, 'home', 0.75, new Vector(move.x, move.y), 0.01, false);
						this.grid.cells[this.position.x][this.position.y].addPheromone(p);
					}

					if (this.grid.cells[this.position.x][this.position.y].food != null &&
						this.food == 0
					) {
						this.grid.cells[this.position.x][this.position.y].food--;
						this.food++;
					}
				}
			} else {
				this.colour = 'magenta';
				if (this.grid.inRange(this.position.x, this.position.y)) {
					var cell = this.grid.cells[this.position.x][this.position.y];
					var direction = cell.getPheromoneDirection('home');

					if (direction != null && (direction.x != 0 || direction.y != 0)) {
						move.x = direction.x*-1;
						move.y = direction.y*-1;
						this.life = 100;
					}
				}

				this.position.x += move.x;
				this.position.y += move.y;

				if (this.grid.inRange(this.position.x, this.position.y)) {
					if (move.x != 0 || move.y != 0) {
						var p = new Pheromone(this.game, 'food', 0.5, new Vector(move.x * -1, move.y * -1), null, null, 4);
						this.grid.cells[this.position.x][this.position.y].addPheromone(p);
					}

					if (this.grid.cells[this.position.x][this.position.y].nest != null) {
						this.grid.cells[this.position.x][this.position.y].nest.food++;
						this.food--;
					}
				}
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

			if (this.grid.inRange(this.position.x, this.position.y)) {
				if (move.x != 0 || move.y != 0) {
					this.grid.cells[this.position.x][this.position.y].occupied++;
					if (this.grid.inRange(this.position.x-move.x, this.position.y-move.y)) {
						this.grid.cells[this.position.x-move.x][this.position.y-move.y].occupied--;
					}
				}

				if (this.grid.cells[this.position.x][this.position.y].monsters.length > 0) {


					this.grid.cells[this.position.x][this.position.y].monsters[0].attack();
					this.pheromoneCloud(8, 'danger', '1', 10, false, 1);
				}
			}
		}

		this.game.shouldRender = true;
	}
}

export default Ant;
import Square from './Square'
import Ant from './Ant';
import Vector from './Vector';
import Grid from './Grid';

class Nest extends Square {
	constructor(game, grid, position) {
		super(game, position, 16, 'red');
		this.grid = grid;
		this.food = 10;
		this.spawnWaitTime = 2500;
		this.counter = this.spawnWaitTime;
	}

	update() {
		this.counter += this.game.delta * this.game.timescale;
		while (this.counter > this.spawnWaitTime) {
			this.spawnAnt();
			this.counter -= this.spawnWaitTime;
		}
	}

	spawnAnt() {
		if (this.food > 0) {
			this.food--;

			var ant = new Ant(this.game, this.grid);
			ant.position = this.position.add(new Vector(0, 0));
			this.grid.cells[ant.position.x][ant.position.y].occupied++;
			// this.game.world.add(ant);
			this.game.ants.push(ant);
		}
	}
}

export default Nest;
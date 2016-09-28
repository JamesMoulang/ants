import Square from './Square';

class Food extends Square {
	constructor(game, grid, position) {
		super(game, position, 16, '#00ff00');
		this.level = 10;
		this.grid = grid;
		this.grid.cells[position.x][position.y].food = this;
	}

	update() {
		this.alpha = this.level / 10;
	}
}

export default Food;
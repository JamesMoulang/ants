import Sprite from './Sprite';
import Vector from './Vector';
import ShadowSprite from './ShadowSprite';

class Spore extends ShadowSprite {
	constructor(game, grid, position, canvas) {
		super(game, position, canvas.canvas, 'seed_flying_idle');
		this.canvas = canvas;
		this.grid = grid;
		this.altitude = 6;
		this.gravity = -9.8*0.1;
		this.airVelocity = 1;
		this.landed = false;
		this.velocity = new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalised().times(0.25);
		if (this.velocity.x == 0 && this.velocity.y == 0) {
			this.velocity[Math.random() < 0.5 ? 'x' : 'y'] = Math.random() < 0.5 ? -1 : 1;
		}
	}

	update() {
		var dt = this.game.delta;
		if (!this.landed) {
			this.position = this.position.add(this.velocity.times(dt));
			this.airVelocity += this.gravity*dt;
			this.altitude+=this.airVelocity*dt;
			if (this.altitude <= 0) {
				this.land();
			}
			this.updateChildren();
		}
	}

	land() {
		this.landed = true;
		var position = this.position.round();
		if (this.grid.inRange(position.x, position.y)) {
			if (this.grid.cells[position.x][position.y].food == null) {
				this.grid.cells[position.x][position.y].setFood(10);
			}
		}

		this.destroy();
	}

	render() {
		// super.render(this.canvas.canvas, this.canvas.ctx);
	}
}

export default Spore;
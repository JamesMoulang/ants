import Circle from './Circle';
import Vector from './Vector';

class Trail extends Circle {
	constructor(game, position, radius, colour, velocity, zIndex) {
		super(game, position, radius, colour, zIndex)
		this.startRadius = radius;
		this.counter = 0;
		this.velocity = velocity;
		this.wiggle = new Vector(Math.random()-0.5, Math.random()-0.5).normalised().times(1);
		this.shrinkSpeed = 0.5;
		this.friction = 1;
	}

	update() {
		var toZero = this.velocity.normalised().times(-this.game.delta);
		this.velocity = this.velocity.add(toZero.times(this.friction));
		var move = this.velocity.add(this.wiggle);
		this.position = this.position.add(move.times(this.game.delta));
		this.radius -= this.game.delta * this.shrinkSpeed;
		if (this.radius < 0) {
			this.radius = 0;
			this.destroy();
		}
	}
}

export default Trail;
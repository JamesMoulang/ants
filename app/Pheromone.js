class Pheromone {
	constructor(game, key, intensity, direction, degrade=0.25, stack=true, max=10) {
		this.key = key;
		this.direction = direction;
		this.intensity = intensity;
		this.degrade = degrade * 0.000025;
		this.game = game;
		if (this.intensity > 0) {
			this.alive = true;
		} else {
			this.alive = false;
		}
		this.max = max;
	}

	add(intensity) {
		this.intensity += intensity;
		if (this.intensity > this.max) {
			this.intensity = this.max;
		}
	}

	update() {
		this.intensity -= this.degrade * this.game.timescale;
		if (this.intensity <= 0) {
			this.intensity = 0;
			this.alive = false;
		}
	}
}

export default Pheromone;
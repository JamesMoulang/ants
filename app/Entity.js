import Vector from './Vector';

class Entity {
	constructor(game, position = new Vector(0, 0)) {
		this.position = position;
		this.alive = true;
		this.game = game;
		this.tag = game.getID();
	}

	_update() {
		if (this.alive) {
			this.update();
		}
	}

	update() {

	}

	_render(canvas, ctx, camera) {
		if (this.alive) {
			this.render(canvas, ctx, camera);
		}	
	}

	render() {
		
	}

	destroy() {
		this.alive = false;
	}
}

export default Entity;
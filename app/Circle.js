import Vector from './Vector';
import Entity from './Entity';

class Circle extends Entity {
	constructor(game, position = new Vector(0, 0), radius = 32, colour = '#ffffff', zIndex = 0) {
		super(game);
		this.game = game;
		this.position = position;
		this.radius = radius;
		this.colour = colour;
		this.alpha = 1;
		this.useCache = false;
	}

	update() {
		
	}

	render(canvas, ctx) {
		if (this.alive) {
			var radius = this.radius * this.game.camera.scale;
			var midPoint = this.game.camera.getMidPoint();
			var x = midPoint.x + (this.position.x - this.game.camera.position.x) * this.game.camera.scale;
			var y = midPoint.y + (this.position.y - this.game.camera.position.y) * this.game.camera.scale;

			if (this.game.camera.inBounds(x, y, radius)) {
				var cache_canvas = this.game.circleCanvases[radius];
				
				if (cache_canvas == null || !this.useCache) {
					ctx.fillStyle = this.colour;
					ctx.globalAlpha = this.alpha;
					ctx.beginPath();
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
					ctx.fill();
				} else {
					x -= radius;
					y -= radius;
					ctx.drawImage(cache_canvas, x, y);
				}
			}
		}
	}
}

export default Circle;
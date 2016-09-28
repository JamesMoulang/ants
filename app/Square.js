import Entity from './Entity';
import Images from './Images';

class Square extends Entity {
	constructor(game, position, size=16, colour='#000000') {
		super(game, position);
		this.size = size;
		this.colour = colour;
		this.shouldRender = true;
	}

	render(canvas, ctx, cleared=false) {
		if (this.shouldRender && this.game.camera.inBounds(this.position.x, this.position.y, this.size)) {
			var size = this.size * this.game.camera.scale;
			var midPoint = this.game.camera.midPoint;
			var x = midPoint.x + (this.position.x - this.game.camera.position.x) * 16 * this.game.camera.scale;
			var y = midPoint.y + (this.position.y - this.game.camera.position.y) * 16 * this.game.camera.scale;

			var colour = this.colour;
			if (this.colour == 'red') {
				colour = '#ff0000';
			} else if (this.colour == 'blue') {
				colour = '#0000ff';
			} else if (this.colour == 'magenta') {
				colour = '#ff00ff';
			} else if (this.colour == 'green') {
				colour = '#00ff00';
			} else if (this.colour == 'black') {
				colour = '#000000';
			} else if (this.colour == 'orange') {
				colour = '#FFA000';
			}

			ctx.imageSmoothingEnabled = false;

			ctx.fillStyle = '#ffffff';
			ctx.globalAlpha = 1;
			if (!cleared && !this.game.cleared) {
				ctx.fillRect(
					(x),
					(y),
					(16*this.game.camera.scale),
					(16*this.game.camera.scale)
				);
			}
			ctx.fillStyle = colour;
			ctx.globalAlpha = this.alpha;
			ctx.fillRect(
				((x+(16-this.size)*this.game.camera.scale*0.5)),
				((y+(16-this.size)*this.game.camera.scale*0.5)),
				(size),
				(size)
			);
		}
	}
}

export default Square;
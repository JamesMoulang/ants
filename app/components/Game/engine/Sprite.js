import Entity from './Entity';
import Images from './Images';
import Vector from './Vector';

class Sprite extends Entity {
	constructor(game, position, key, smoothing=false) {
		super(game, position);
		this.key = key;
		if (!Images.cache[key]) {
			console.warn('no image with key' + key);
		} else {
			this.image = Images.cache[key];
		}
		this.position = position;
		this.anchor = {
			x: 0.5,
			y: 0.5
		};
		this.width = this.image.width;
		this.height = this.image.height;
		this.alpha = 1;
		this.smoothing = smoothing;
		this.useGlobalCoords = false;
	}

	setAnchor(x, y) {
		this.anchor.x = x;
		this.anchor.y = y;
	}

	loadTexture(key) {
		if (!Images.cache[key]) {
			console.warn('no image with key' +key);
		} else {
			this.image = Images.cache[key];
			this.width = this.image.width;
			this.height = this.image.height;
		}
	}

	update() {

	}

	render(canvas, ctx) {
		if (this.alive && this.game.camera.inBounds(this.position.x, this.position.y, this.width)) {
			ctx.imageSmoothingEnabled = this.smoothing;
			var midPoint = this.game.camera.midPoint;
			var x = midPoint.x + (this.position.x - this.game.camera.position.x) * 16 * this.game.camera.scale;
			var y = midPoint.y + (this.position.y - this.game.camera.position.y) * 16 * this.game.camera.scale;
			var width = this.width * this.game.camera.scale;
			var height = this.height * this.game.camera.scale;
			// console.log(width, height, this.game.camera.scale, this.width, this.height);
			var _scale = this.smoothing ? 1 : 16;

			if (this.useGlobalCoords) {
				x = this.position.x;
				y = this.position.y;
				width = this.width;
				height = this.height;
			}

			ctx.globalAlpha = this.alpha;
			ctx.drawImage(
				this.image,
				x-(width*this.anchor.x)*this.smoothing, 
				y-(height*this.anchor.y)*this.smoothing, 
				width*this.smoothing, 
				height*this.smoothing
			);
		}
	}
}

export default Sprite;
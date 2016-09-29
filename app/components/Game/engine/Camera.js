import Vector from './Vector';
import Maths from './Maths';

class Camera {
	constructor(game, x = 0, y = 0, scale = 1) {
		this.position = new Vector(x, y);
		this.game = game;
		this.scale = scale;
		this.zoom = 1;
		this.deadZoneRatio = 0.00125;
		this.debug = false;
		this.deadZone = {
			width: game.width * this.deadZoneRatio,
			height: game.height * this.deadZoneRatio
		};
		this.deadZoneSnapRatio = 4;
		this.midPoint = new Vector(0, 0);
	}

	inBounds(x, y, radius) {
		return (
			x - radius < this.game.canvas.width  && 
			x + radius > 0 && 
			y - radius < this.game.canvas.height && 
			y + radius > 0
		);
	}
 
	onCanvasResize() {
		var ratio = this.game.width / this.game.height;
		//Set scale so this.height * scale = this.canvas.height

		this.scale = this.game.canvas.height / this.game.height;
		if (this.game.height * ratio > this.game.canvas.width) {
			this.scale = this.game.canvas.width / this.game.width;
		}
		this.scale *= this.zoom;

		this.deadZone = {
			width: this.game.width * this.deadZoneRatio,
			height: this.game.height * this.deadZoneRatio
		};

		this.midPoint = this.getMidPoint();

		// this.scale = 1;
	}

	getMidPoint() {
		return new Vector(
			this.game.canvas.width * 0.5,
			this.game.canvas.height * 0.5
		);
	}

	lerp(target, amount) {
		var nextPosition = this.position.lerp(target, amount);
		this.move(nextPosition.minus(this.position));
	}

	move(v) {
		this.position = this.position.add(v);
		if (!this.game.input.pointer.movedThisFrame) {
			this.game.input.pointer.world = this.game.input.pointer.world.add(v);
		}
	}

	followPlayer(position) {
		var move = new Vector(0, 0);

		if (position.x > this.position.x + this.deadZone.width * 0.5) {
			var distance = position.x - (this.position.x + this.deadZone.width * 0.5);
			var t = Math.pow(distance / (this.deadZone.width * this.deadZoneSnapRatio * 0.5), 1);

			var nextX = Maths.lerp(this.position.x, t, position.x - this.deadZone.width * 0.5);
			move.x = nextX - this.position.x;
		} else if (position.x < this.position.x - this.deadZone.width * 0.5) {
			var distance = (this.position.x - this.deadZone.width * 0.5) - position.x;
			var t = Math.pow(distance / (this.deadZone.width * this.deadZoneSnapRatio * 0.5), 1);

			var nextX = Maths.lerp(this.position.x, t, position.x + this.deadZone.width * 0.5);
			move.x = nextX - this.position.x;
		}

		if (position.y > this.position.y + this.deadZone.height * 0.5) {
			var distance = position.y - (this.position.y + this.deadZone.height * 0.5);
			var t = Math.pow(distance / (this.deadZone.height * this.deadZoneSnapRatio * 0.5), 1);

			var nextY = Maths.lerp(this.position.y, t, position.y - this.deadZone.height * 0.5);
			move.y = nextY - this.position.y;
		} else if (position.y < this.position.y - this.deadZone.height * 0.5) {
			var distance = (this.position.y - this.deadZone.height * 0.5) - position.y;
			var t = Math.pow(distance / (this.deadZone.height * this.deadZoneSnapRatio * 0.5), 1);

			var nextY = Maths.lerp(this.position.y, t, position.y + this.deadZone.height * 0.5);
			move.y = nextY - this.position.y;
		}

		this.move(move);

		// this.lerp(position, 0.05);
	}
}

export default Camera;
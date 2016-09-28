//Take the shadow code out of monster and put it here.
import Group from './Group';
import Sprite from './Sprite';
import Vector from './Vector';

class ShadowSprite extends Group {
	constructor(game, position, canvas, key) {
		super(game, canvas);
		this.position = position;
		this.altitude = 0;
		this.offset = new Vector(0, 0);

		this.shadow = new Sprite(game, position, 'shadow');
		this.add(this.shadow);
		this.shadow.anchor.x = 0.5;
		this.shadow.anchor.y = 0.5;
		this.shadow.alpha = 0.2;

		this.body = new Sprite(game, position, key);
		this.add(this.body);

		if (this.body.width <= 4) {
			this.shadowKey = 'shadow_small';
		} else if (this.body.width == 3) {
			this.shadowKey = 'shadow_mini';
		} else {
			this.shadowKey = 'shadow';
		}
		this.shadow.loadTexture(this.shadowKey);
	}

	updateChildren() {
		this.body.position = this.position.add(this.offset.minus(new Vector(0, this.altitude)));
		this.shadow.position = this.position.add(this.offset);
		this.game.shouldRender = true;
	}
}

export default ShadowSprite;
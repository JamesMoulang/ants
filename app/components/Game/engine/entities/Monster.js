import Sprite from '../Sprite';
import Group from '../Group';
import Vector from '../Vector';
import ShadowSprite from '../ShadowSprite';

class Monster extends ShadowSprite {
	constructor(game, grid, position, canvas, key, hitbox) {
		super(game, position, canvas, key + '_friendly_idle');
		
		this.hitbox = hitbox;
		this.grid = grid;
		this.monsterType = key;

		this.body.anchor.x = 0.5;
		this.body.anchor.y = 1;

		this.timer = 0;
		this.waitTime = 24;

		this.mood = 'friendly';
		this.stance = 'idle';
		this.dead = false;
		this.health = 250;

		this.move(new Vector(0, 0));
		this.game.shouldRender = true;
	}

	attack() {
		this.attacked = true;
		this.health--;
		if (this.health == 0) {
			this.destroy();
		}
	}

	setTexture() {
		this.body.loadTexture(this.monsterType+'_'+this.mood+'_'+this.stance);
	}

	setMood(mood) {
		this.mood = mood;
		this.setTexture();
	}

	walkTexture() {
		this.stance = this.stance == 'walk0' ? 'walk1' : 'walk0';
		this.setTexture();
	}

	idleTexture() {
		this.stance = 'idle';
		this.setTexture();
	}

	forHitbox(callback) {
		for (var _x = 0; _x < this.hitbox.x; _x++) {
			for (var _y = 0; _y < this.hitbox.y; _y++) {
				var x = this.position.x - Math.floor(this.hitbox.x * 0.5) + _x;
				var y = this.position.y - Math.ceil(this.hitbox.y * 0.5) + _y;

				if (this.grid.inRange(x, y)) {
					callback(this.grid.cells[x][y]);
				}
			}
		}
	}

	destroy() {
		this.forHitbox(function(cell) {
			cell.monsterLeave(this);
		}.bind(this));
		this.game.shouldRender = true;
		super.destroy();
	}

	die() {
		this.dead = true;
		this.mood = 'dead';
		this.stance = 'idle';
		this.setTexture();
		this.game.shouldRender = true;
	}

	lookAroundYou(radius, callback) {
		//Just. Look. Around you.
		var maxdist = radius*radius;

		for (var _x = 0; _x < radius*2; _x++) {
			for (var _y = 0; _y < radius*2; _y++) {
				var x = (this.position.x - radius) + _x;
				var y = (this.position.y - radius) + _y;
				var dist = Math.pow(this.position.x-x, 2) + Math.pow(this.position.y-y, 2);

				if (dist < maxdist && this.grid.inRange(x, y)) {
					callback(this.grid.cells[x][y], dist);
				}
			}
		}
	}

	move(move) {
		this.forHitbox(function(cell) {
			cell.monsterLeave(this);
		}.bind(this));
		this.position = this.position.add(move);
		this.forHitbox(function(cell) {
			cell.monsterEnter(this);
		}.bind(this));

		this.updateChildren();
	}

	update() {
		super.update();

		// this.timer += this.game.timescale;
		// while(this.timer >= this.waitTime) {
		// 	this.timer -= this.waitTime;
		// 	this.tick();
		// }
	}

	tick() {
		this.game.shouldRender = true;
	}
}

export default Monster;
import _ from 'lodash';
import Entity from './Entity';

class Group extends Entity {
	constructor(game, canvas, consistentStyle, fillStyle, strokeStyle, alpha) {
		super(game);
		this.tag = null;

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = fillStyle;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.globalAlpha = alpha;
		this.strokeStyle = strokeStyle;
		this.consistentStyle = consistentStyle;
		
		this.game = game;
		this.entities = [];
		this.alive = true;
		this.shouldDepthSort = false;
	}

	add(entity) {
		entity.group = this;
		this.entities.push(entity);
		this.depthSort();
		return entity;
	}

	depthSort() {
		if (this.shouldDepthSort) {
			this.entities = _.sortBy(this.entities, (entity) => {
				return entity.position.y;
			});
		}
	}

	getEntitiesWithTagName(tag) {
		var entities = [];
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].tag == tag) {
				entities.push(this.entities[i]);
			} else {
				if (this.entities[i].tag == null) {
					entities.push(this.entities[i].getEntitiesWithTagName(tag));
				}
			}
		}
		return entities;
	}

	update() {
		if (this.alive) {
			var length = this.entities.length + 0;
			this.entities = _.filter(this.entities, function(entity) {
				return entity.alive;
			});
			if (this.alive) {
				for (var i = this.entities.length - 1; i >= 0; i--) {
					this.entities[i].update();
				}
			}
		}
	}

	destroy() {
		super.destroy();
		_.each(this.entities, (entity) => {
			entity.destroy();
		});
	}

	render() {
		if (this.consistentStyle) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].render(this.canvas, this.ctx);
			}
			this.ctx.fill();
		} else {
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].render(this.canvas, this.ctx);
			}
		}
	}
}

export default Group;
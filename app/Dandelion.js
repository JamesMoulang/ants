import Monster from './Monster';
import TickState from './TickState';
import Vector from './Vector';
import TickStateMachine from './TickStateMachine';
import Spore from './Spore';
import Maths from './Maths';

const STATE_KEYS = {
	GROWING: 'GROWING',
	GROWN: 'GROWN',
	WITHERING: 'WITHERING'
};

class Dandelion extends Monster {
	constructor(game, grid, position, canvas) {
		super(game, grid, position, canvas, 'dandelion', new Vector(1, 1));
		this.sporeCount = 5;
		this.state = new TickStateMachine(new TickState(
			STATE_KEYS.GROWING,
			this.growingStateEnter.bind(this),
			this.growingStateTick.bind(this),
			this.growingStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.GROWN,
			this.grownStateEnter.bind(this),
			this.grownStateTick.bind(this),
			this.grownStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.WITHERING,
			this.witheringStateEnter.bind(this),
			this.witheringStateTick.bind(this),
			this.witheringStateExit.bind(this)
		));
	}

	tick() {
		super.tick();
		this.state.tick();
	}

	growingStateEnter() {
		this.mood = 'growing';
		this.stance = 1;
		this.setTexture();
	}
	growingStateTick() {
		var stance = (Math.floor(this.state.tickCounter / 1) + 1).toString();
		if (this.stance != stance) {
			this.stance = stance;
			if (this.stance > 4) {
				this.state.switchState(STATE_KEYS.GROWN);
			} else {
				this.setTexture();
			}
		}
	}
	growingStateExit() {
		this.mood = 'complete';
		this.stance = 'idle';
		this.setTexture();
	}

	grownStateEnter() {

	}
	grownStateTick() {
		if (this.state.tickCounter > 50) {
			this.state.switchState(STATE_KEYS.WITHERING);
		}
	}
	grownStateExit() {
		this.releaseSpores();
	}

	releaseSpores() {
		var neighbours = Maths.clamp(this.grid.cells[this.position.x][this.position.y].neighbouringFoodCount(), 3, 9);
		// for (var i = 0; i < this.sporeCount; i++) {
		// 	var spore = new Spore(this.game, this.game.grid, this.position, this.game.monsterCanvas);
		// 	this.game.world.add(spore);
		// 	spore.velocity=spore.velocity.times(Math.pow(neighbours / 3, 2));
		// }
		var influence = (neighbours-3) / 5;
		// console.log(influence);
		//So a low number should mean a smaller circle of influence.
		var radius = 2 + Math.round(influence * 20);
		var left = Math.floor(this.position.x - radius * 0.5);
		var right = Math.ceil(this.position.x + radius * 0.5);
		var bottom = Math.floor(this.position.y - radius * 0.5);
		var top = Math.ceil(this.position.y + radius * 0.5);
		var area = (right-left)*(top-bottom);
		var chance = 10 / area;
		for (var x = left; x <= right; x++) {
			for (var y = bottom; y <= top; y++) {
				if (Math.pow(x-this.position.x, 2) + Math.pow(y-this.position.y, 2) < area) {
					if (this.grid.inRange(x, y) && this.grid.cells[x][y].food == null) {
						this.grid.cells[x][y].setFood(20);
						// this.grid.cells[x][y].highlight();
					}
				}
			}
		}
	}

	render() {

	}

	witheringStateEnter() {
		this.mood = 'growing';
		this.stance = 4;
	}
	witheringStateTick() {
		var stance = (4 - Math.floor(this.state.tickCounter / 25)).toString();
		if (this.stance != stance) {
			this.stance = stance;
			if (this.stance < 1) {
				this.grid.cells[this.position.x][this.position.y].dandelion = null;
				this.destroy();
			} else {
				this.setTexture();
			}
		}
	}
	witheringStateExit() {

	}
}

export default Dandelion;
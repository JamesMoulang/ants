import Monster from './Monster';
import Vector from './Vector';
import TickStateMachine from './TickStateMachine';
import TickState from './TickState';

var STATE_KEYS = {
	IDLE: 'IDLE',
	AIMLESS: 'AIMLESS',
	LOOKING: 'LOOKING',
	WALKING: 'WALKING',
	EATING: 'EATING',
	DEAD: 'DEAD'
}

class Forager extends Monster {
	constructor(game, grid, position, canvas) {
		super(game, grid, position, canvas, 'forager', new Vector(4, 1));
		this.waitTime = 10;
		this.target = null;
		this.energy = 200;
		this.minFood = 0;
		this.birthed = false;
		this.viewRadius = 8;

		this.state = new TickStateMachine(new TickState(
			STATE_KEYS.IDLE,
			this.idleStateEnter.bind(this),
			this.idleStateTick.bind(this),
			this.idleStateExit.bind(this)
		));
		// this.state.debug = true;

		this.state.add(new TickState(
			STATE_KEYS.LOOKING,
			this.lookingStateEnter.bind(this),
			this.lookingStateTick.bind(this),
			this.lookingStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.AIMLESS,
			this.aimlessStateEnter.bind(this),
			this.aimlessStateTick.bind(this),
			this.aimlessStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.WALKING,
			this.walkingStateEnter.bind(this),
			this.walkingStateTick.bind(this),
			this.walkingStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.EATING,
			this.eatingStateEnter.bind(this),
			this.eatingStateTick.bind(this),
			this.eatingStateExit.bind(this)
		));

		this.state.add(new TickState(
			STATE_KEYS.DEAD,
			this.deadStateEnter.bind(this),
			this.deadStateTick.bind(this),
			this.deadStateExit.bind(this)
		));
	}

	idleStateEnter() {}
	idleStateTick() {
		this.state.switchState(STATE_KEYS.AIMLESS);
	}
	idleStateExit() {}

	lookingStateEnter() {
		// console.log("looking...");
		this.target = null;
		var highest = null;
		var d = Infinity;
		this.lookAroundYou(this.viewRadius, function(cell, dist) {
			if (cell.food != null && cell.food > this.minFood) {
				if (highest == null || (d > dist)) {
					highest = cell;
					d = dist;
				}
			}
		}.bind(this));

		if (highest != null) {
			this.target = highest;
		}

		if (this.energy > 350) {
			this.haveChild();
			this.energy -= 50;
		}
	}
	lookingStateTick() {
		if (this.target == null) {
			// console.log("aimless.");
			this.state.switchState(STATE_KEYS.AIMLESS);
		} else {
			// console.log("walking.");
			this.state.switchState(STATE_KEYS.WALKING);
		}
	}
	lookingStateExit() {
		//TODO: If energy is high enough, have a child.
	}

	aimlessStateEnter() {
		this.wanderTarget = this.position.add(
			new Vector(
				Math.random() < 0.5 ? 1 : -1,
				Math.random() < 0.5 ? 1 : -1
			)
			.normalised()
			.times(this.viewRadius*0.5)
			.round()
		);
	}
	aimlessStateTick() {
		var move = this.walkTowards(this.wanderTarget, function() {
			this.state.switchState(STATE_KEYS.LOOKING);
		}.bind(this));
	}
	aimlessStateExit() {}

	walkTowards(target, callback) {
		var move = new Vector(0, 0);

		if (this.position.x < target.x) {
			move.x = 1;
		} else if (this.position.x > target.x) {
			move.x = -1;
		} else {
			move.x = 0;
		}

		if (this.position.y < target.y) {
			move.y = 1;
		} else if (this.position.y > target.y) {
			move.y = -1;
		} else {
			move.y = 0;
		}

		if (move.x == 0 && move.y == 0) {
			callback();
		} else {
			this.move(move);
		}
	}

	walkingStateEnter() {}
	walkingStateTick() {
		var move = this.walkTowards(this.target.position, function() {
			this.state.switchState(STATE_KEYS.EATING);
		}.bind(this));
	}
	walkingStateExit() {}

	eatingStateEnter() {
		this.hungry = false;
	}
	eatingStateTick() {
		if (this.target.food > this.minFood) {
			this.energy+=2;
			this.target.food--;
			if (this.target.food < this.minFood) {
				this.target = null;
			}
		} else {
			this.target = null;
		}
		if (this.target == null) {
			this.state.switchState(STATE_KEYS.LOOKING);
		}
	}
	eatingStateExit() {
		this.hungry = true;
	}

	deadStateEnter() {
		this.decomposeLevel = -1;
	}
	deadStateTick() {
		var level = Math.floor(this.state.tickCounter / 75) - 1;
		if (level != this.decomposeLevel) {
			if (level > 3) {
				this.destroy();
			} else {
				this.decomposeLevel = level;
				this.mood = 'decompose';
				this.stance = this.decomposeLevel.toString();
				this.setTexture();
			}
		}
	}
	deadStateExit() {}

	haveChild() {
		this.birthed = true;
		var child = new Forager(this.game, this.grid, this.position, this.canvas);
		this.game.world.add(child);
	}

	die() {
		super.die();
		this.state.switchState(STATE_KEYS.DEAD);
	}

	tick() {
		super.tick();
		if (!this.dead) {
			if (this.hungry) {
				this.energy--;
			}
			if (this.energy == 0) {
				this.die();
			}
		}
		this.state.tick();
	}
}

export default Forager;
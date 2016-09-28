import Monster from './Monster';
import Vector from './Vector';
import TickStateMachine from './TickStateMachine';
import TickState from './TickState';

class Predator extends Monster {
	constructor(game, grid, position, canvas) {
		super(game, grid, position, canvas, 'monster', new Vector(8, 2));
		this.mood = 'asleep';
		this.stance = 'idle';
		this.setTexture();
		this.attacked = false;
		this.attackTimer = 0;
		this.attackCooldown = 10;
		this.rage = 0;
		this.health = 100;
	}

	attack() {
		if (!this.attacked) {
			this.mood = 'angry';
			this.setTexture();
			this.attackTimer = 0;
		}
		this.rage = 200;
		super.attack();
	}

	calm() {
		if (this.attacked) {
			this.mood = 'friendly';
			this.setTexture();
			this.attacked = false;
		}
	}

	update() {
		super.update();
	}

	chomp() {
		console.log("nom.");
		this.forHitbox(function(cell) {
			cell.makeDeadly();
		}.bind(this));
	}

	tick() {
		super.tick();
		if (this.attacked) {
			this.rage--;
			if (this.rage < 0) {
				this.calm();
			} else {
				this.attackTimer++;
				if (this.attackTimer > this.attackCooldown) {
					this.attackTimer-=this.attackCooldown;
					this.chomp();
				}
				this.move(new Vector(
					Math.round((Math.random() - 0.5) * 2), 
					Math.round((Math.random() - 0.5) * 2)
				));
			}
		}
	}
}

export default Predator;
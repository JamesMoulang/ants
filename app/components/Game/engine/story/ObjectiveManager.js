import Objective from './Objective';

class ObjectiveManager {
	constructor(game) {
		this.game = game;
		this.active = false;
		this.objectives = [];
		this.objectiveIndex = 0;
		this.currentObjective = null;
	}

	update() {
		if (this.currentObjective != null) {
			if (this.game.winCondition()) {
				this.finish();
			}
		}
	}

	start() {
		var obj = this.getCurrentObjective();
		this.currentObjective = obj;
		this.active = true;
		obj.start();
	}

	finish() {
		this.active = false;
		var obj = this.getCurrentObjective();
		if (obj != null) obj.finish();
	}

	addObjective(introduction, conclusion, winCondition) {
		this.objectives.push(new Objective(this.game, introduction, conclusion, winCondition, this.onObjectiveEnd.bind(this)));
	}

	onObjectiveEnd() {
		this.objectiveIndex++;
	}

	getCurrentObjective() {
		if (this.objectiveIndex < this.objectives.length) {
			return this.objectives[this.objectiveIndex];
		} else {
			return null;
		}
	}
}

export default ObjectiveManager;
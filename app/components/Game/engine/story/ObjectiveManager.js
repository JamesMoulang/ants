import Objective from './Objective';

class ObjectiveManager {
	constructor(game) {
		this.game = game;
		this.active = false;
		this.objectives = [];
		this.objectiveIndex = 0;
		this.currentObjective = null;
		this.first = true;
	}

	update() {
		if (this.currentObjective != null) {
			if (this.game.winCondition()) {
				this.finish();
			}
		}
	}

	firstModalClose() {
		if (this.first) {
			this.game.start();
			this.first = false;
		} else {
			this.game.restart();
		}
	}

	start() {
		var obj = this.getCurrentObjective();
		if (obj != null) {
			this.currentObjective = obj;
			this.active = true;
			obj.start();
		}
	}

	finish() {
		this.active = false;
		var obj = this.getCurrentObjective();
		if (obj != null) obj.finish();
	}

	addObjective(introduction, conclusion, winCondition) {
		var obj = new Objective(this.game, introduction, conclusion, winCondition, this.onObjectiveEnd.bind(this));
		obj.level = this.objectives.length;
		this.objectives.push(obj);
	}

	onObjectiveEnd() {
		this.objectiveIndex++;
		this.start();
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
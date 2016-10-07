class Objective {
	constructor(game, introduction, conclusion, winCondition, callback=null) {
		this.game = game;
		this.introduction = introduction;
		this.conclusion = conclusion;
		this.winCondition = winCondition;
		this.level = -1;
	}

	start() {
		console.log("STARTING AN OBJECTIVE!", this.level);
		this.game.setLevel(this.level);
		this.game.showModal(true, this.introduction);
		this.game.winCondition = this.winCondition;
	}

	finish() {
		this.game.showModal(true, this.conclusion);
		if (this.callback != null) {
			this.callback();
		}
	}
}

export default Objective;
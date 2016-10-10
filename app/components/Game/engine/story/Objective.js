class Objective {
	constructor(game, introduction, conclusion, winCondition, callback=null, line=null, timescale=200) {
		this.game = game;
		this.introduction = introduction;
		this.conclusion = conclusion;
		this.winCondition = winCondition;
		this.level = -1;
		this.line = line;
		this.callback = callback;
		this.timescale = timescale;
	}

	start() {
		this.game.setLevel(this.level);
		this.game.showModal(true, this.introduction);
		this.game.winCondition = this.winCondition;
		this.game._timescale = this.timescale + 0;

		console.log("STARTING AN OBJECTIVE!", this.level, this.timescale, this.game.timescale);
	}

	finish() {
		this.game.showModal(true, this.conclusion);
		if (this.callback != null) {
			this.callback();
		}
	}
}

export default Objective;
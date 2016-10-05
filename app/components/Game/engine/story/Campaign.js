import ObjectiveManager from './ObjectiveManager';

class Campaign extends ObjectiveManager {
	constructor(game) {
		super(game);

		this.addObjective(
			{
				title: "Mission: 1", 
				description: "Get an ant over the finish line. Read the API if you need some help.",
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Mission 1",
				description: "Congratulations!",
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				var line = 12*12;
				var complete = false;
				var _dist = 0;
				_.each(this.ants, function(ant) {
					var dist = 
						Math.pow(ant.position.x-this.nest.position.x, 2) + 
						Math.pow(ant.position.y-this.nest.position.y, 2);
					console.log(dist);
					if (dist > line) {
						complete = true;
						if (dist > _dist) _dist = dist;
					}
				}.bind(this));
				return complete;
			}.bind(this.game)
		);

		this.addObjective(
			{
				title: "Mission: 2", 
				description: "Get an ant over the finish line. Read the API if you need some help.",
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Mission 2",
				description: "Congratulations!",
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				var line = 12*12;
				var complete = false;
				var _dist = 0;
				_.each(this.ants, function(ant) {
					var dist = 
						Math.pow(ant.position.x-this.nest.position.x, 2) + 
						Math.pow(ant.position.y-this.nest.position.y, 2);
					console.log(dist);
					if (dist > line) {
						complete = true;
						if (dist > _dist) _dist = dist;
					}
				}.bind(this));
				return complete;
			}.bind(this.game)
		);

		this.addObjective(
			{
				title: "Final Mission", 
				description: "There's no objective here - you've reached the end. Congratulations! You can just play with and tweak your ants for as long as you want now.",
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Final Mission...?",
				description: "whaaaat? You must be some kind of hacker.",
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				return false;
			}.bind(this.game)
		);
	}
}

export default Campaign;
import ObjectiveManager from './ObjectiveManager';

class Campaign extends ObjectiveManager {
	constructor(game) {
		super(game);

		this.addObjective(
			{
				title: "Mission: 1", 
				description: "Get an ant over the finish line. Read the API if you need some help."
			}, 
			{
				title: "Completed Mission 1",
				description: "Congratulations!"
			}, 
			function() {
				var line = 12*12;
				var complete = false;
				_.each(this.ants, function(ant) {
					var dist = Math.pow(ant.x-this.nest.x, 2) + Math.pow(ant.y-this.nest.y, 2);
					if (dist < line) {
						complete = true;
					}
				}.bind(this));

				return complete;
			}.bind(this.game)
		);
	}
}

export default Campaign;
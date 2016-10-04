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
	}
}

export default Campaign;
import ObjectiveManager from './ObjectiveManager';

class Campaign extends ObjectiveManager {
	constructor(game) {
		super(game);

		this.addObjective(
			{
				title: "Mission: 1", 
				description: [
					"In this game, your nest (red square) will continually create ants (black squares). Write code in the left box and hit the play button to see it run. You're controlling the ant logic - every time the game world updates, the ants will make decisions and move around based on that code.",
					"Your objective is to move at least one ant outside of the blue circle.",
					"Read the API for a list of built in functions the ants can use, and more information.",
					"Click this text box to start the mission!"
				],
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Mission 1",
				description: ["Congratulations!"],
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
					if (dist > line) {
						complete = true;
						if (dist > _dist) _dist = dist;
					}
				}.bind(this));
				return complete;
			}.bind(this.game),
			12,
			10
		);

		this.addObjective(
			{
				title: "Mission: 2", 
				description: [
					"In addition to moving, ants can leave a pheromone on their current square. Check out the updated API for details.",
					"Try to fill 10 squares with pheromones.",
					"Click this text box to start the mission!"
				],
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Mission 2",
				description: [
					"Congratulations!",
					"Click this text box to start the next mission."
				],
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				var limit = 10;
				var valid = 0;
				_.each(this.activeCells, function(cell) {
					if (cell.hasAnyPheromones()) {
						valid++;
					}
				}.bind(this));
				console.log(valid, limit);
				return valid >= limit;
			}.bind(this.game),
			null,
			10
		);

		this.addObjective(
			{
				title: "Mission: 3", 
				description: [
					"Now, try and cover half of the blue circle in pheromones.",
					"How are you going to keep the ants inside the circle?",
					"Click this text box to start the mission!"
				],
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Mission 3",
				description: [
					"Congratulations!",
					"Click this text box to start the next mission."
				],
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				var limit = Math.PI * 12*12 * 0.5;
				var valid = 0;
				_.each(this.activeCells, function(cell) {
					if (cell.hasAnyPheromones() && cell.position.distance(this.nest.position) <= 12) {
						valid++;
					}
				}.bind(this));
				console.log(valid, limit);
				return valid >= limit;
			}.bind(this.game),
			12,
			10
		);

		this.addObjective(
			{
				title: "Final Mission", 
				description: ["There's no objective here - you've reached the end. Congratulations! You can just play with and tweak your ants for as long as you want now."],
				onClose: this.firstModalClose.bind(this)
			}, 
			{
				title: "Completed Final Mission...?",
				description: ["whaaaat? You must be some kind of hacker."],
				onClose: this.onObjectiveEnd.bind(this)
			}, 
			function() {
				return false;
			}.bind(this.game)
		);
	}
}

export default Campaign;
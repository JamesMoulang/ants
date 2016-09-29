import _ from 'underscore';
import Vector from './Vector';
import Entity from './Entity';
import Audio from './Audio';
import KeyInput from './KeyInput';
import StateManager from './StateManager';
import State from './State';
import Group from './Group';
import Camera from './Camera';
import Maths from './Maths';
import Images from './Images';

import Ant from './entities/Ant';
import Grid from './entities/Grid';
import Nest from './entities/Nest';
import Forager from './entities/Forager';
import Predator from './entities/Predator';

const codes = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
	up: 38,
	p: 80,
	q: 81,
	left: 37,
	down: 40,
	right: 39,
	space: 32
};


class Game {
	constructor(width, height, parent, canvas, ctx, fps) {
		this.parent = parent;
		this.currentID = 0;
		this.canvas = canvas;
		this.canvases = [];
		this.ctx = ctx;
		this.fps = fps;
		this.idealFrameTime = 1000 / this.fps;
		this.width = width;
		this.height = height;
		this.camera = new Camera(this);
		this.entities = [];
		this.delta = 1;
		this.world = new Group(this, this.canvas);
		this.lastInput = null;
		this.circleCanvases = {};
		this.shouldRender = true;
		this._timescale = 200;
		this.timescale = this._timescale + 0;
		window.onblur = this.pause.bind(this);
		window.onfocus = this.play.bind(this);
		this.parent.onblur = this.pause.bind(this);
		this.parent.onfocus = this.play.bind(this);
		this.pictureWaitTime = 10000;
		this.pictureCounter = 0;
		this.activeCells = [];
		this.minX = -1;
		this.minY = -1;
		this.maxX = -1;
		this.maxY = -1;
		this.cleared = true;
		this.moveCamera = true;
		this.camera.zoom = 0.129;
		this.ants = [];
		this.monsters = [];
		this.antUpdateRate = 12;
		this.antUpdateCounter = 0;

		this.cellUpdateRate = 24;
		this.cellUpdateCounter = 0;
		
		this.canvases = [];
		this.monsterCanvas = this.createCanvas();
		window.onresize = this.resizeCanvas.bind(this);
		this.resizeCanvas();

		// Images.onLoad = this.start.bind(this);
		Images.load('monster_asleep_idle', '/images/monster_asleep_idle.png');
		Images.load('monster_angry_idle', '/images/monster_angry_idle.png');
		Images.load('monster_angry_walk0', '/images/monster_angry_walk0.png');
		Images.load('monster_angry_walk1', '/images/monster_angry_walk1.png');
		Images.load('monster_friendly_idle', '/images/monster_friendly_idle.png');
		Images.load('monster_friendly_walk0', '/images/monster_friendly_walk0.png');
		Images.load('monster_friendly_walk1', '/images/monster_friendly_walk1.png');
		Images.load('monster_angry', '/images/monster_angry.png');
		Images.load('monster_scared', '/images/monster_scared.png');
		Images.load('monster_kid_friendly', '/images/monster_kid_friendly.png');
		Images.load('monster_kid_angry', '/images/monster_kid_angry.png');
		Images.load('monster_kid_scared', '/images/monster_kid_scared.png');
		Images.load('shadow', '/images/shadow.png');
		Images.load('shadow_small', '/images/shadow_small.png');
		Images.load('shadow_mini', '/images/shadow_mini.png');
		Images.load('forager_friendly_idle', '/images/forager_friendly_idle.png');
		Images.load('forager_friendly_walk0', '/images/forager_friendly_walk0.png');
		Images.load('forager_friendly_walk1', '/images/forager_friendly_walk1.png');
		Images.load('forager_dead_idle', '/images/forager_dead_idle.png');
		Images.load('forager_decompose_0', '/images/forager_decompose_0.png');
		Images.load('forager_decompose_1', '/images/forager_decompose_1.png');
		Images.load('forager_decompose_2', '/images/forager_decompose_2.png');
		Images.load('forager_decompose_3', '/images/forager_decompose_3.png');

		Images.load('dandelion_friendly_idle', '/images/spore_growing_1.png');
		Images.load('dandelion_growing_1', '/images/spore_growing_1.png');
		Images.load('dandelion_growing_2', '/images/spore_growing_2.png');
		Images.load('dandelion_growing_3', '/images/spore_growing_3.png');
		Images.load('dandelion_growing_4', '/images/spore_growing_4.png');
		Images.load('dandelion_complete_idle', '/images/spore_complete_idle.png');
		Images.load('seed_flying_idle', '/images/seed_flying_idle.png');

		Audio.load('tom1', '/tom1.wav');
		Audio.load('tom2', '/tom2.wav');
		Audio.load('tick', '/tick.wav');
		Audio.load('Gs3', '/xylophone/Gs3.wav');
		Audio.load('B4', '/xylophone/B4.wav');
		Audio.load('Cs4', '/xylophone/Cs4.wav');
		Audio.load('Ds4', '/xylophone/Ds4.wav');
		Audio.load('Fs4', '/xylophone/Fs4.wav');
	}

	pause() {
		this.timescale = 0;
	}

	play() {
		this.timescale = this._timescale + 0;
	}

	takePicture() {
		// console.log("snap!");
	}

	createCanvas(id) {
		var canv = document.createElement('canvas');
		canv.id = id;
		canv.style.zIndex = this.canvases.push(canv) + 1;
		canv.style.position = 'absolute';
		canv.style.display = 'block';
		this.parent.appendChild(canv);
		this.resizeCanvas();
		return {
			canvas: canv,
			ctx: canv.getContext('2d')
		};
	}

	resizeCanvas () {
		var width = this.parent.clientWidth;
		var height = this.parent.clientHeight;

		this.canvas.width = width;
		this.canvas.height = height;

		for (var i = this.canvases.length - 1; i >= 0; i--) {
			this.canvases[i].width = width;
			this.canvases[i].height = height;
		}
		this.camera.onCanvasResize();
		this.cleared = true;
		this.shouldRender = true;
	}

	getID() {
		this.currentID++;
		return this.currentID;
	}

	start() {
		if (Images.isLoaded()) {
			this.grid = new Grid(this, 512, 512);
			this.world.add(this.grid);
			this.camera.position = new Vector(this.grid.cells.length * 0.5, this.grid.cells.length * 0.5);

			var nest = new Nest(this, this.grid, new Vector(this.grid.cells.length * 0.5, this.grid.cells.length * 0.5));
			this.grid.cells[nest.position.x][nest.position.y].nest = nest;
			this.world.add(nest);
			this.nest = nest;

			this.minX = nest.position.x - 16;
			this.maxX = nest.position.x + 16;
			this.minY = nest.position.y - 16;
			this.maxY = nest.position.y + 16;

			this.grid.populate();
			this.grid.bump();

			this.lastTimestamp = this.timestamp();
			this.loop();
		} else {
			setTimeout(this.start.bind(this), 100);
		}
	}

	loop() {
		var lastFrameTimeElapsed = this.timestamp() - this.lastTimestamp;
		this.delta = lastFrameTimeElapsed / this.idealFrameTime;
		this.update();
		this.render();
		this.lastTimestamp = this.timestamp();
		if (lastFrameTimeElapsed < this.idealFrameTime) {
			setTimeout(this.loop.bind(this), this.idealFrameTime - lastFrameTimeElapsed);
		} else {
			this.loop();
		}
	}

	success() {
		this.lastInput.success = true;
	}

	failure() {
		this.lastInput.colour = '#000000';
	}

	//Game stuff, not rhythm. Can run slower than rhythm.
	update() {
		this.pictureCounter += this.delta * this.timescale;
		if (this.pictureCounter > this.pictureWaitTime) {
			this.takePicture();
			this.pictureCounter -= this.pictureWaitTime;
		}
		this.world.update();
		this.antUpdateCounter += this.delta * this.timescale;
		while(this.antUpdateCounter > this.antUpdateRate) {
			this.ants = _.filter(this.ants, function(ant) {
				return ant.alive;
			});
			this.monsters = _.filter(this.monsters, function(monster) {
				return monster.alive;
			});

			_.each(this.ants, function(ant) {
				ant.tick();
			});
			_.each(this.monsters, function(monster) {
				monster.tick();
			});
			this.antUpdateCounter -= this.antUpdateRate;
		}

		this.cellUpdateCounter += this.delta * this.timescale;
		while(this.cellUpdateCounter > this.cellUpdateRate) {
			this.activeCells = _.filter(this.activeCells, function(cell) {
				return cell.active;
			});
			_.each(this.activeCells, function(cell) {
				cell.update();
			});
			this.cellUpdateCounter -= this.cellUpdateRate;
		}
	}

	clear(canvas=this.canvas, ctx=this.ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.cleared = true;
	}

	//Render stuff.
	render() {
		if (this.shouldRender) {
			this.clear(this.monsterCanvas.canvas, this.monsterCanvas.ctx);

			var width = this.maxX - this.minX;
			var height = this.maxY - this.minY;
			var max = (width > height) ? width : height;

			if (this.moveCamera) {
				var zoom = 1 / (max / 64);

				var targetX = this.minX + (this.maxX-this.minX)*0.5;
				var targetY = this.minY + (this.maxY-this.minY)*0.5;

				// targetX = this.monster.position.x;
				// targetY = this.monster.position.y;
				
				this.cleared = false;

				if (Math.abs(this.camera.zoom - zoom) > 0) {
					this.camera.zoom = Maths.towardsValue(this.camera.zoom, this.delta*0.125, zoom);
					this.camera.onCanvasResize();
					this.clear();
				}

				if (Math.abs(this.camera.position.x-targetX) != 0 || Math.abs(this.camera.position.y-targetY) != 0) {
					this.camera.position.x = Maths.towardsValue(this.camera.position.x, this.delta * 0.1 / this.camera.zoom, targetX);
					this.camera.position.y = Maths.towardsValue(this.camera.position.y, this.delta * 0.1 / this.camera.zoom, targetY);
					this.clear();
				}
			} else {
				this.cleared = false;
			}

			_.each(this.activeCells, function(cell) {
				cell.render(this.canvas, this.ctx);
			}.bind(this));
			this.world.render();
			_.each(this.ants, function(ant) {
				ant.render(this.canvas, this.ctx);
			}.bind(this));
			_.each(this.monsters, function(monster) {
				monster.render();
			}.bind(this));
		}
		this.shouldRender = false;

		// this.ctx.fillStyle = this.cleared ? '#ff0000' : '#ffffff';
		// this.ctx.fillRect(0, 0, 16, 16);
	}

	timestamp() {
		return performance.now();
	}
}

export default Game;
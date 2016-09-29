import State from './State';

class StateManager {
	constructor() {
		this.states = [];
		this.currentState = null;
	}

	switchState(tag) {
		var nextState = null;
		for (var i = 0; i < this.states.length; i++) {
			if (tag == this.states[i].tag) {
				nextState = this.states[i];
			}
		}

		if (nextState != null) {
			if (this.currentState != null) {
				this.currentState.exit();
			}

			this.currentState = nextState;
			if (this.currentState.created) {
				this.currentState.enter();
			} else {
				this.currentState.create();
			}
		}
	}

	add(state) {
		for (var i = 0; i < this.states.length; i++) {
			if (this.states[i].tag == state.tag) {
				throw new Error("duplicate state tag");
			}
		}
		this.states.push(state);
	}

	update() {
		if (this.currentState != null) {
			this.currentState.update();
		}
	}
}

export default StateManager;
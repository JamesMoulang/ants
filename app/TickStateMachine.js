import TickState from './TickState';

class TickStateMachine {
	constructor(initialState) {
		this.states = [initialState];
		this.currentState = initialState;
		this.currentState.enter();
		this.debug = false;
		this.tickCounter = 0;
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
			if (this.debug) {
				console.log("Switching state to: " + tag);
			}
			this.tickCounter = 0;
			this.currentState.enter();
		}
	}

	tick() {
		if (this.currentState != null) {
			this.tickCounter++;
			this.currentState.tick();
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
}

export default TickStateMachine;
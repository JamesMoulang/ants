export const PAUSE = 'PAUSE';
export function pause() {
	return {
		type: PAUSE
	}
}

export const PLAY = 'PLAY';
export function play() {
	return {
		type: PLAY
	}
}

export const SHOW_API = 'SHOW_API';
export function showAPI() {
	return {
		type: SHOW_API
	}
}

export const HIDE_API = 'HIDE_API';
export function hideAPI() {
	return {
		type: HIDE_API
	}
}

export const SET_LEVEL = 'SET_LEVEL';
export function setLevel(level=0) {
	return {
		type: SET_LEVEL,
		data: level
	}
}

export const TOGGLE_METHOD = 'TOGGLE_METHOD';
export function toggleMethod(method) {
	return {
		type: TOGGLE_METHOD,
		data: method
	}
}
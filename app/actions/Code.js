export const UPDATE_ANT_CODE = 'UPDATE_ANT_CODE';
export function updateAntCode(code='') {
	return {
		type: UPDATE_ANT_CODE,
		data: code
	}
}

export const UPDATE_VISUAL_CODE = 'UPDATE_VISUAL_CODE';
export function updateVisualCode(code='') {
	return {
		type: UPDATE_VISUAL_CODE,
		data: code
	}
}

export const SUCCESS_ANT_CODE = 'SUCCESS_ANT_CODE';
export function successAntCode(code='') {
	return {
		type: SUCCESS_ANT_CODE,
		data: code
	}
}
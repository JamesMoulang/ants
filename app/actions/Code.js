export const UPDATE_ANT_CODE = 'UPDATE_ANT_CODE';
export function updateAntCode(code='') {
	return {
		type: UPDATE_ANT_CODE,
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
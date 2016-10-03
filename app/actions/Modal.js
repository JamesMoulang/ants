export const SHOW_MODAL = 'SHOW_MODAL';
export function showModal() {
	return {
		type: SHOW_MODAL
	}
}

export const HIDE_MODAL = 'HIDE_MODAL';
export function hideModal() {
	return {
		type: HIDE_MODAL
	}
}

export const CHANGE_MODAL = 'CHANGE_MODAL';
export function changeModal(contents=<div/>) {
	return {
		type: CHANGE_MODAL,
		data: contents
	}
}
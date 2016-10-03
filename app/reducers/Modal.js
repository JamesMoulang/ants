import * as Actions from '../actions/Modal';

export default function Modal(state={
	content: {
		title: '',
		description: ''
	},
	showing: false
}, action) {
	switch(action.type){
		case Actions.SHOW_MODAL:
			return Object.assign({}, state, {showing: true});
		case Actions.HIDE_MODAL:
			return Object.assign({}, state, {showing: false});
		case Actions.CHANGE_MODAL:
			return Object.assign({}, state, {content: action.data});
		default:
			return state;
	}
}

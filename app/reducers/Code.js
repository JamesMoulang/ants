import * as Actions from '../actions/Code';

export default function Code(state={
	code: '',
	visualCode: '',
	pushed: true
}, action) {
	switch(action.type){
		case Actions.UPDATE_ANT_CODE:
			return Object.assign({}, state, {code: action.data, pushed: false});
		case Actions.SUCCESS_ANT_CODE:
			return Object.assign({}, state, {pushed: true});
		case Actions.UPDATE_VISUAL_CODE:
			return Object.assign({}, state, {visualCode: action.data});
		default:
			return state;
	}
}

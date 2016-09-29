import * as Actions from '../actions/Code';

export default function Code(state={
  code: '',
  pushed: true
}, action) {
  switch(action.type){
    case Actions.UPDATE_ANT_CODE:
      return Object.assign({}, state, {code: action.data, pushed: false});
    case Actions.SUCCESS_ANT_CODE:
    	return Object.assign({}, state, {pushed: true});
    default:
      return state;
  }
}

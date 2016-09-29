import * as Actions from '../actions/Code';

export default function Code(state={
  code: ''
}, action) {
  switch(action.type){
    case Actions.UPDATE_CODE:
      return Object.assign({}, state, {code: action.data})
    default:
      return state;
  }
}

import * as Actions from '../actions/Game';

export default function Game(state={
  paused: false,
  showingAPI: true
}, action) {
  switch(action.type){
    case Actions.PAUSE:
      return Object.assign({}, state, {paused: true})
    case Actions.PLAY:
      return Object.assign({}, state, {paused: false})
    case Actions.SHOW_API:
    	return Object.assign({}, state, {showingAPI: true})
  	case Actions.HIDE_API:
    	return Object.assign({}, state, {showingAPI: false})
    default:
      return state;
  }
}

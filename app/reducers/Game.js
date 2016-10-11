import * as Actions from '../actions/Game';
import _ from 'lodash';

export default function Game(state={
  paused: true,
  showingAPI: false,
  level: 0,
  toggledMethods: []
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
    case Actions.TOGGLE_METHOD:
      var toggledMethods = _.without(state.toggledMethods, action.data);
      toggledMethods.push(action.data);
      return Object.assign({}, state, {toggledMethods})
    case Actions.SET_LEVEL:
      return Object.assign({}, state, {level: action.data})
    default:
      return state;
  }
}

import * as Actions from '../actions/Game';

export default function Game(state={
  paused: false
}, action) {
  switch(action.type){
    case Actions.PAUSE:
      return Object.assign({}, state, {paused: true})
    case Actions.PLAY:
      return Object.assign({}, state, {paused: false})
    default:
      return state;
  }
}

import { combineReducers } from "redux";

import Code from './Code';
import Game from './Game';

const rootReducer = combineReducers({
  Code,
  Game
});

export default rootReducer;

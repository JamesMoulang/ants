import { combineReducers } from "redux";

import Code from './Code';
import Game from './Game';
import Modal from './Modal';

const rootReducer = combineReducers({
  Code,
  Game,
  Modal
});

export default rootReducer;

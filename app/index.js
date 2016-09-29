import 'babel-polyfill';
import React, {Component} from 'react';
import { render } from 'react-dom';
import { App } from './components';

import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

render(
	(
		<Provider store={store}>
			<App/>
		</Provider>
	),
	document.getElementById('root')
);
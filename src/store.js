import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import { isProd } from './util';

import testReducer from './sections/main/modules';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-underscore-dangle */

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ test: testReducer }),
  composeEnhancers(applyMiddleware(thunkMiddleware, sagaMiddleware)),
);

export default store;

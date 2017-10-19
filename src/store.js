import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHashHistory from 'history/createHashHistory';

import { isProd } from './util';

import { reduxGridSagas, marketDataReducer } from './sections/reduxGrid/modules';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-underscore-dangle */

export const history = createHashHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combineReducers({
    marketData: marketDataReducer,
    routing: routerReducer,
  }),
  composeEnhancers(applyMiddleware(thunkMiddleware, sagaMiddleware, routeMiddleware)),
);

sagaMiddleware.run(...reduxGridSagas);

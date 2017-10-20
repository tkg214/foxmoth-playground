import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { takeEvery } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import axios from 'axios';
import { normalize, schema } from 'normalizr';

const prefix = 'redux-grid';

const constants = {
  fetchMarketDataSucceeded: `${prefix}/FETCH_MARKET_DATA_SUCCEEDED`,
  fetchMarketDataFailed: `${prefix}/FETCH_MARKET_DATA_FAILED`,
};

const stockSchema = new schema.Entity('stocks', {}, { idAttribute: 'symbol' });

const fetchMarketData = (report) => {
  return axios.get(`https://api.iextrading.com/1.0/stock/market/${report}`);
};

const fetchMarketDataSucceededAction = (payload) => {
  return {
    type: constants.fetchMarketDataSucceeded,
    payload,
  };
};

const fetchMarketDataFailedAction = (payload) => {
  return {
    type: constants.fetchMarketDataFailed,
    payload,
  };
};

// TODO merge openClose dataset
const mergeData = (data) => {
  return _.map(data[1], (obj) => {
    const key = obj.symbol;
    return _.assign(
      {},
      {
        symbol: key,
        previous: obj,
      },
    );
  });
};

function* reduxGridLocationChangeSaga(action) {
  if (action.payload.pathname === '/redux') {
    try {
      // eslint-disable-next-line no-unused-vars
      const [openClose, previous] = yield all([
        call(fetchMarketData, 'open-close'),
        call(fetchMarketData, 'previous'),
      ]);
      if (openClose.status === 200 && previous.status === 200 && openClose.data && previous.data) {
        const mergedData = yield call(mergeData, [openClose.data, previous.data]);
        const normalizedData = normalize(mergedData, [stockSchema]);
        yield put(fetchMarketDataSucceededAction(normalizedData));
      }
    } catch (error) {
      yield put(fetchMarketDataFailedAction(error));
    }
  }
}

function* reduxGridLocationChangeSagaWatcher() {
  yield* takeEvery(LOCATION_CHANGE, reduxGridLocationChangeSaga);
}

const initialState = Immutable({
  stocks: {},
  ready: false,
});

export const marketDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.fetchMarketDataSucceeded:
      return state.set('ready', true).set('stocks', action.payload.entities.stocks);
    default:
      return state;
  }
};

export const reduxGridSagas = [reduxGridLocationChangeSagaWatcher];

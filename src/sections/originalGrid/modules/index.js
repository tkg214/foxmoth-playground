import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import swaptionDataJson from '../../../util/fakeSwaptionData.json';
import { agGridFormattedSwaptionData, swaptionData } from './instrument-type';
import { swaptionDataCacheReducer } from './cache';

const prefix = 'original-grid';

const constants = {
  fetchSwaptionDataSucceeded: `${prefix}/FETCH_SWAPTION_DATA_SUCCEEDED`,
};

// mocks an async call
const mockFetch = (result) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 3000);
  });
};

const fetchSwaptionDataSucceeded = (payload) => {
  return {
    type: constants.fetchSwaptionDataSucceeded,
    payload,
  };
};

function* originalGridLocationChangeSaga(action) {
  if (action.payload.pathname === '/original') {
    const data = yield call(mockFetch, swaptionDataJson);
    yield put(fetchSwaptionDataSucceeded(data));
  }
}

function* originalGridLocationChangeSagaWatcher() {
  yield* takeEvery(LOCATION_CHANGE, originalGridLocationChangeSaga);
}

const initialState = Immutable({
  data: {},
  ready: false,
});

const swaptionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.fetchSwaptionDataSucceeded:
      return state.set('ready', true).set('data', action.payload);
    default:
      return state;
  }
};

export const originalDataReducer = combineReducers({
  swaption: swaptionDataReducer,
  swaptionCache: swaptionDataCacheReducer,
});

export const originalGridSagas = [originalGridLocationChangeSagaWatcher];

export const originalDataSelectors = { agGridFormattedSwaptionData, swaptionData };

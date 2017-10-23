import _ from 'lodash';
import { combineReducers } from 'redux';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import swaptionDataJson from '../../../util/fakeSwaptionData.json';
import { agGridFormattedSwaptionData, swaptionData, formatSwaptionForAgGrid, mapVolatilities } from './instrument-type';
import { swaptionDataCacheReducer } from './cache';

const prefix = 'original-grid';

export const constants = {
  FETCH_SWAPTION_DATA_SUCCEEDED: `${prefix}/FETCH_SWAPTION_DATA_SUCCEEDED`,
  UPDATE_QUOTE_VALUE: `${prefix}/UPDATE_QUOTE_VALUE`,
  STORE_FORMATTED_DATA: `${prefix}/STORE_FORMATTED_DATA`,
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
    type: constants.FETCH_SWAPTION_DATA_SUCCEEDED,
    payload,
  };
};

const storeFormattedData = (payload) => {
  return {
    type: constants.STORE_FORMATTED_DATA,
    payload,
  };
};

export const updateQuoteValue = (params) => {
  return {
    type: constants.UPDATE_QUOTE_VALUE,
    payload: params,
  };
};

function* originalGridLocationChangeSaga(action) {
  if (action.payload.pathname === '/original') {
    const data = yield call(mockFetch, swaptionDataJson);
    const clonedData = _.cloneDeep(data);
    clonedData.volatilities = mapVolatilities(clonedData);
    const formattedData = formatSwaptionForAgGrid(clonedData);
    yield put(storeFormattedData(formattedData));
    yield put(fetchSwaptionDataSucceeded(data));
  }
}

function* originalGridLocationChangeSagaWatcher() {
  yield* takeEvery(LOCATION_CHANGE, originalGridLocationChangeSaga);
}

const initialState = {
  data: {},
  ready: false,
};

const swaptionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_SWAPTION_DATA_SUCCEEDED:
      return Object.assign(state, {
        ready: true,
        data: action.payload,
      });
    // case constants.UPDATE_QUOTE_VALUE: {
    //   const {
    //     strikeIndex, rowIndex, columnIndex, newValue,
    //   } = action.payload.params;
    //   const statePath = ['data', 'volatilities', strikeIndex, rowIndex, columnIndex];
    //   return state.setIn(statePath, newValue);
    // }
    default:
      return state;
  }
};

const rowDataReducer = (state = [], action) => {
  switch (action.type) {
    case constants.STORE_FORMATTED_DATA:
      return action.payload;
    case constants.UPDATE_QUOTE_VALUE: {
      const { rowIndex, newValue, key } = action.payload.params;
      return [
        ...state.slice(0, rowIndex),
        Object.assign({}, state[rowIndex], {
          [key]: newValue,
        }),
        ...state.slice(rowIndex + 1),
      ];
    }
    default:
      return state;
  }
};

export const originalDataReducer = combineReducers({
  rowData: rowDataReducer,
  swaption: swaptionDataReducer,
  swaptionCache: swaptionDataCacheReducer,
});

export const originalGridSagas = [originalGridLocationChangeSagaWatcher];

export const originalDataSelectors = { agGridFormattedSwaptionData, swaptionData };

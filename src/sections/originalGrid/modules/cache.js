import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Immutable({
  changedMarketValues: [],
});

export const UPDATE_QUOTE_VALUE = 'original-data/UPDATE_QUOTE_VALUE';

export const updateQuoteValue = (params) => {
  return {
    type: UPDATE_QUOTE_VALUE,
    payload: params,
  };
};

export const swaptionDataCacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case (LOCATION_CHANGE): {
      const { pathname } = action.payload;
      if (pathname !== '/market-data-inspection') {
        return state.set('changedMarketValues', initialState.changedMarketValues);
      }
      return state;
    }
    case UPDATE_QUOTE_VALUE:
      return state.setIn(['changedMarketDataValues'], state.changedMarketDataValues.concat(action.payload.params));
    default:
      return state;
  }
};

export const changedMarketDataValues = state =>
  state.originalData.swaptionDataCache.changedMarketDataValues;

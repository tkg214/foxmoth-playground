import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { constants } from '../modules';

const initialState = Immutable({
  changedDataValues: [],
});

export const swaptionDataCacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case (LOCATION_CHANGE): {
      const { pathname } = action.payload;
      if (pathname !== '/market-data-inspection') {
        return state.set('changedDataValues', initialState.changedDataValues);
      }
      return state;
    }
    case constants.UPDATE_QUOTE_VALUE:
      return state.set('changedDataValues', state.changedDataValues.concat(action.payload));
    default:
      return state;
  }
};

export const changedDataValues = state =>
  state.originalData.swaptionDataCache.changedDataValues;

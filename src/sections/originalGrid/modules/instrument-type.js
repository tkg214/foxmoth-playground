import _ from 'lodash';
import { createSelector } from 'reselect';

const customFieldKeyword = 'customField';

function formatExpiriesToRowData(values) {
  return _.map(values, (value) => {
    return { expiry: value };
  });
}

const formatDataToCustomFields = (rowData, data, pushNewRow = true) => {
  const clonedRowData = _.cloneDeep(rowData);
  _.forEach(data, (_data, dataIndex) => {
    if (pushNewRow) {
      clonedRowData.push({});
    }
    _.forEach(_data, (value, index) => {
      clonedRowData[dataIndex][`${customFieldKeyword}${index}_`] = value;
      clonedRowData[dataIndex][`${customFieldKeyword}${index}`] = value.value;
    });
  });
  return clonedRowData;
};

export const formatSwaptionForAgGrid = (swaptionData, strikeIndex = 0) => {
  if (!swaptionData) {
    return null;
  }

  let rowData;
  if (swaptionData.expiries) {
    rowData = formatExpiriesToRowData(swaptionData.expiries);
  }
  if (swaptionData.volatilities) {
    rowData = formatDataToCustomFields(rowData, swaptionData.volatilities[strikeIndex], false);
  }
  return rowData;
};

export const swaptionData = state => state.originalData.swaption.data;

const bindMappingData = (array, rowIndex) => {
  return _.map(array, (value, columnIndex) => {
    return {
      value,
      rowIndex,
      columnIndex,
    };
  });
};

export const mapVolatilities = (instrumentData) => {
  return _.map(instrumentData.volatilities, (volatilities) => {
    return _.map(volatilities, (volatility, volatilityRowIndex) => {
      return bindMappingData(volatility, volatilityRowIndex);
    });
  });
};

export const agGridFormattedSwaptionData = createSelector(
  swaptionData,
  (swaption) => {
    const clonedSwaption = _.cloneDeep(swaption);
    if (clonedSwaption.volatilities) {
      clonedSwaption.volatilities = mapVolatilities(clonedSwaption);
    }
    return formatSwaptionForAgGrid(clonedSwaption);
  },
);

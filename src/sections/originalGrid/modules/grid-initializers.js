import _ from 'lodash';
import numeral from 'numeral';

const isPercentageString = (value) => {
  return /^[-+]?[0-9]*\.?[0-9]*%$/.test(value);
};

const convertToNumeralPercentage = (rateString, formatMask = '(0,0.00000 %)') => {
  if (rateString) {
    try {
      let value;
      if (isPercentageString(rateString)) {
        const replacedString = rateString.replace('%', '');
        value = Number(replacedString) / 100;
      } else {
        value = Number(rateString);
      }

      return numeral(value).format(formatMask);
    } catch (err) {
      return rateString;
    }
  }

  return rateString;
};

// eslint-disable-next-line import/prefer-default-export
export const createColumnDefs = (swaptionData, valueGetter, updateQuoteValue) => {
  const columnDefs = [{
    headerName: 'Expiry/Swap',
    field: 'expiry',
    tooltipField: 'expiry',
    headerTooltip: 'Expiry/Swap',
    pinned: 'left',
    width: 90,
  }];

  const mappedSwapLengths = _.map((swaptionData.swap_lengths || []), (length, index) => {
    return {
      headerName: length,
      field: `customField${index}`,
      headerTooltip: length,
      editable: true,
      strikeIndex: 0,
      width: 90,
      valueFormatter: (params) => {
        return _.isNumber(params.value) ? convertToNumeralPercentage(params.value, '(0,0.00 %)') : params.value;
      },
      tooltipField: `customField${index}.quoteValue`,
      newValueHandler: (params) => {
        return updateQuoteValue({ strikeIndex: 0, columnIndex: index }, params);
      },
    };
  });

  return columnDefs.concat(mappedSwapLengths);
};

import _ from 'lodash';

export const createColumnDefs = () => {
  return [
    { headerName: 'Symbol', field: 'symbol' },
    { headerName: 'Open', field: 'open' },
    { headerName: 'Close', field: 'close' },
    { headerName: 'High', field: 'high' },
    { headerName: 'Low', field: 'low' },
    { headerName: 'Change', field: 'change' },
    { headerName: '% Change', field: 'percentChange' },
    { headerName: 'Volume', field: 'volume' },
  ];
};

export const createRowData = (data) => {
  const rowData = [];
  const dataArray = _.values(data);
  if (dataArray.length < 1) {
    return [];
  }
  _.each(dataArray, (stock) => {
    rowData.push({
      symbol: stock.symbol,
      open: stock.previous.open,
      close: stock.previous.close,
      high: stock.previous.high,
      low: stock.previous.low,
      change: stock.previous.change,
      percentChange: stock.previous.changePercent,
      volume: stock.previous.volume,
    });
  });
  return rowData;
};

import _ from 'lodash';

export const createColumnDefs = () => {
  return [
    { headerName: 'Symbol', field: 'symbol' },
    { headerName: 'Open', field: 'open', editable: true },
    { headerName: 'Close', field: 'close', editable: true },
    { headerName: 'High', field: 'high', editable: true },
    { headerName: 'Low', field: 'low', editable: true },
    { headerName: 'Change', field: 'change', editable: true },
    { headerName: '% Change', field: 'percentChange', editable: true },
    { headerName: 'Volume', field: 'volume', editable: true },
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

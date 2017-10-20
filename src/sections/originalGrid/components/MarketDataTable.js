import React, { PureComponent } from 'react';
import _ from 'lodash';
import GridWrapper from '../../../components/grid/GridWrapper';
import { createColumnDefs } from '../modules/grid-initializers';

const AG_GRID_ROW_HEIGHT = 20;
const AG_GRID_HEADER_HEIGHT = 20;

export default class MarketDataTable extends PureComponent {
  constructor(props) {
    super(props);
    this.gridOptions = {
      enableColResize: false,
      enableRangeSelection: true,
      suppressMovableColumns: true,
      suppressMenuColumnPanel: true,
      suppressMenuMainPanel: true,
      getContextMenuItems: this.getContextMenuItems,
      rowHeight: AG_GRID_ROW_HEIGHT,
      headerHeight: AG_GRID_HEADER_HEIGHT,
    };

    this.onGridReady = this.onGridReady.bind(this);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  getContextMenuItems = () => {
    return ['copy', 'copyWithHeaders', 'export'];
  }

  valueGetter = (key, params) => {
    return params.data && params.data[key] && params.data[key].value;
  }

  updateQuoteValue(extraParams, params) {
    if (params.newValue.value !== params.newValue.oldValue) {
      this.props.updateQuoteValue({
        params: _.assign(
          {},
          {
            rowIndex: params.newValue.rowIndex,
            columnIndex: params.newValue.columnIndex,
            newValue: params.newValue.value,
            oldValue: params.newValue.oldValue,
          },
          extraParams,
        ),
      });
    }
  }

  render() {
    if (!this.props.dataReady) {
      return <div>Loading...</div>;
    }

    return (
      <GridWrapper
        onGridReady={this.onGridReady}
        rowData={this.props.rowData}
        columnDefs={createColumnDefs(this.props.swaptionData, this.valueGetter, this.updateQuoteValue)}
        gridOptions={this.gridOptions}
      />
    );
  }
}

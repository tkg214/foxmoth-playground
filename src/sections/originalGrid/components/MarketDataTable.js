import React, { PureComponent } from 'react';
import _ from 'lodash';
import GridWrapper from '../../../components/grid/GridWrapper';
import { createColumnDefs } from '../modules/grid-initializers';
import AgGridCellEditor from './AgGridCellEditor';

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
    this.updateQuoteValue = this.updateQuoteValue.bind(this);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.api;
  }

  getContextMenuItems = () => {
    return ['copy', 'copyWithHeaders', 'export'];
  }

  columnDefs = () => {
    const columnDefs = createColumnDefs(this.props.swaptionData, this.valueGetter, this.updateQuoteValue, AgGridCellEditor);
    return columnDefs;
  }

  valueGetter = (key, params) => {
    return params.data && params.data[key] && params.data[key].value;
  }

  updateQuoteValue(extraParams, params) {
    if (params.newValue !== params.oldValue) {
      this.props.updateQuoteValue({
        params: _.assign(
          {},
          {
            rowIndex: params.node.rowIndex,
            newValue: Number(params.newValue),
            oldValue: params.oldValue,
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
        columnDefs={this.columnDefs()}
        gridOptions={this.gridOptions}
      />
    );
  }
}

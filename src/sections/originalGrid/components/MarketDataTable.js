import React, { PureComponent } from 'react';
import _ from 'lodash';
import GridWrapper from '../../../components/grid/GridWrapper';
import { createColumnDefs } from '../modules/grid-initializers';

const AG_GRID_ROW_HEIGHT = 25;
const AG_GRID_HEADER_HEIGHT = 25;

export default class MarketDataTable extends PureComponent {
  constructor(props) {
    super(props);
    this.gridOptions = {
      deltaRowDataMode: true,
      enableColResize: false,
      enableRangeSelection: true,
      suppressMovableColumns: true,
      suppressMenuColumnPanel: true,
      suppressMenuMainPanel: true,
      getContextMenuItems: this.getContextMenuItems,
      rowHeight: AG_GRID_ROW_HEIGHT,
      headerHeight: AG_GRID_HEADER_HEIGHT,
      enableImmutableMode: true,
      getRowNodeId: (data) => {
        return data.expiry;
      },
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
    const columnDefs = createColumnDefs(this.props.swaptionData, this.valueGetter, this.updateQuoteValue);
    return columnDefs;
  }

  valueGetter = (key, params) => {
    return params.data && params.data[key] && params.data[key].value;
  }

  updateQuoteValue(extraParams, params) {
    const { colDef, node } = params;
    const colDefInnerValueKey = `${colDef.field}_`;
    const colDefInnerValues = _.has(node, `data.${colDefInnerValueKey}`) && node.data[colDefInnerValueKey];

    if (params.newValue !== params.oldValue) {
      this.props.updateQuoteValue({
        params: _.assign(
          {},
          {
            key: colDef.field,
            rowIndex: colDefInnerValues.rowIndex,
            columnIndex: colDefInnerValues.columnIndex,
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

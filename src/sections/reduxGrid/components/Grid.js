import React, { Component } from 'react';
import GridWrapper from '../../../components/grid/GridWrapper';
import { createColumnDefs, createRowData } from '../modules/grid-initializers';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: createColumnDefs(),
      rowData: createRowData(this.props.stocks),
    };
    this.onGridReady = this.onGridReady.bind(this);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <GridWrapper
        columnDefs={this.state.columnDefs}
        rowData={this.state.rowData}
        onGridReady={this.onGridReady}
      />
    );
  }
}

export default Grid;

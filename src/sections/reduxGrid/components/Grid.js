import React, { Component } from 'react';
import GridWrapper from '../../../components/grid/GridWrapper';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
      ],
      rowData: [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
      ],
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

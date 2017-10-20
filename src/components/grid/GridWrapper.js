import React, { PureComponent } from 'react';
import { AgGridReact } from 'ag-grid-react';

export default class GridWrapper extends PureComponent {
  render() {
    return (
      <div style={{ height: 800, width: '100%' }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.props.columnDefs}
          rowData={this.props.rowData}
          onGridReady={this.props.onGridReady}
          gridOptions={this.props.gridOptions}
        />
      </div>
    );
  }
}

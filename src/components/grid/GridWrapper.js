import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

export default class GridWrapper extends Component {
  static defaultProps = {
    options: {
      rowSelection: 'multiple',
      rowHeight: 20,
    },
  };

  render() {
    return (
      <div style={{ height: 800, width: '100%' }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.props.columnDefs}
          rowData={this.props.rowData}
          onGridReady={this.props.onGridReady}
          {...this.props.options}
        />
      </div>
    );
  }
}

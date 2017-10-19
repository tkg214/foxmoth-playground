/* eslint react/prop-types: 0 */
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
      <div style={{ height: 410, width: 800 }} className="ag-fresh">
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

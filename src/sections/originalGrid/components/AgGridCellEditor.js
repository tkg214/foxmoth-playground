import React, { Component } from 'react';
import _ from 'lodash';

function isNumeric(num) {
  return !isNaN(num) && isFinite(num);
}

function tryFloatConversion(value) {
  return isNumeric(value)
    ? parseFloat(value)
    : value;
}

const NAVIGATION_KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  HOME: 36,
  END: 35,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  ENTER: 13,
  TAB: 9
};

const KEYS_TO_STOP_GRID_NAVIGATION = [
  NAVIGATION_KEYS.LEFT,
  NAVIGATION_KEYS.UP,
  NAVIGATION_KEYS.RIGHT,
  NAVIGATION_KEYS.DOWN,
  NAVIGATION_KEYS.HOME,
  NAVIGATION_KEYS.END,
  NAVIGATION_KEYS.PAGE_UP,
  NAVIGATION_KEYS.PAGE_DOWN
];

const KEYS_TO_STOP_EDITING = [
  NAVIGATION_KEYS.ENTER,
  NAVIGATION_KEYS.TAB
];

function convertToPercentageValIfSwaption(value, type) {
  if (type === 'swaption') {
    return isNumeric(tryFloatConversion(value)) ? tryFloatConversion(value) * 100 : value;
  }
  return value;
}

function convertBackToPercentageValue(value) {
  return isNumeric(tryFloatConversion(value)) ? tryFloatConversion(value) / 100 : value;
}

class AgGridCellEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: convertToPercentageValIfSwaption(props.value, props.market_data_template),
      swaptionValue: props.value,
      storedValue: convertToPercentageValIfSwaption(props.value, props.market_data_template)
    };
  }

  get value() {
    return this.state.value;
  }

  get storedValue() {
    return this.state.storedValue;
  }

  get colId() {
    return this.props.column.colId;
  }

  stopEditing = () => {
    const rowCount = this.props.api.paginationGetRowCount() - 1;

    const dontFireEditedAction = tryFloatConversion(this.value) === tryFloatConversion(this.storedValue);

    const rowIndexToFocus = this.props.rowIndex < rowCount ? this.props.rowIndex + 1 : this.props.rowIndex;

    this.props.api && this.props.api.stopEditing(dontFireEditedAction);
    this.props.api && this.props.api.setFocusedCell(rowIndexToFocus, this.colId);
    if ((this.props.rowDataLength - 1) !== this.props.rowIndex) {
      this.props.api && this.props.api.startEditingCell({
        rowIndex: rowIndexToFocus,
        colKey: this.colId
      });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if (!this.refs.agGridCellEditor) return;
      this.refs.agGridCellEditor.select();


      //This puts the keydown listener on top of the queue, and we stop propagation 
      //to AG-Grid's navigation otherwise AG-Grid's keyboard navigation stops the bubbling to our component.
      this.refs.agGridCellEditor.addEventListener('keydown', this.onKeydown);
    }, 0);
  }

  componentWillUnmount() {
    this.refs.agGridCellEditor.removeEventListener('keydown', this.onKeydown);
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  get data() {
    return this.props.node && this.props.node.data;
  }

  get columnData() {
    return this.data[this.colId];
  }

  getValue = () => {
    if (this.value && this.data) {
      if (this.props.market_data_template === 'swaption') {
        const value = convertBackToPercentageValue(this.value);
        const storedValue = convertBackToPercentageValue(this.storedValue);
        return _.assign(this.columnData, { value: tryFloatConversion(value), oldValue: storedValue });
      }
      return _.assign(this.columnData, { value: tryFloatConversion(this.value), oldValue: this.state.storedValue });
    }
    return _.assign(this.columnData, { value: 'n/a', oldValue: this.state.storedValue });
  }

  getCharCodeFromEvent(event) {
    event = event || window.event;
    return (typeof event.which === "undefined") ? event.keyCode : event.which;
  }

  onKeydown = (event) => {
    const key = this.getCharCodeFromEvent(event);

    if (_.includes(KEYS_TO_STOP_GRID_NAVIGATION, key)) {
      event.stopPropagation();
    }

    if (_.includes(KEYS_TO_STOP_EDITING, key)) {
      this.stopEditing();
    }
  };

  render() {
    return <input
      className="mdi-ag-grid-cell-editor"
      type="text"
      ref="agGridCellEditor"
      onBlur={this.stopEditing}
      onChange={this.onChange}
      value={this.value}></input>;
  }
}

export default AgGridCellEditor;

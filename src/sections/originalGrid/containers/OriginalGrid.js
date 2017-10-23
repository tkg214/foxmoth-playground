import React from 'react';
import { connect } from 'react-redux';
import { originalDataSelectors, updateQuoteValue } from '../modules';
import MarketDataTable from '../components/MarketDataTable';

const OriginalGrid = (props) => {
  return (
    <div>
      <MarketDataTable
        dataReady={props.dataReady}
        rowData={props.rowData}
        swaptionData={props.swaptionData}
        updateQuoteValue={props.updateQuoteValue}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    rowData: state.originalData.rowData,
    swaptionData: originalDataSelectors.swaptionData(state),
    dataReady: state.originalData.swaption.ready,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateQuoteValue: (params) => { dispatch(updateQuoteValue(params)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OriginalGrid);

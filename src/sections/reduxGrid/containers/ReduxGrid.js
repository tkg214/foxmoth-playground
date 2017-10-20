import React from 'react';
import { connect } from 'react-redux';

import Grid from '../components/Grid';

const ReduxGrid = (props) => {
  if (!props.marketData.ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Grid stocks={props.marketData.stocks} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    marketData: state.marketData,
  };
};

export default connect(mapStateToProps)(ReduxGrid);

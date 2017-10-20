import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { store, history } from './store';
import App from './components/App';

// eslint-disable-next-line
LicenseManager.setLicenseKey('ag-Grid__Evaluation_License_Not_for_Production_1Devs20_December_2017__MTUxMzcyODAwMDAwMA==b730c1c811cad86d703cf8d287b598ff');

const render = (Component, reduxStore, reduxHistory) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={reduxStore}>
        <Component history={reduxHistory} />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App, store, history);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const newApp = require('./components/App').default;
    render(newApp);
  });
}

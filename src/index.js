import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { store, history } from './store';
import App from './components/App';

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

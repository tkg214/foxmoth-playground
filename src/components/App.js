import React from 'react';
import { Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Home from '../sections/home/components/Home';
import ReduxGrid from '../sections/reduxGrid/containers/ReduxGrid';

const App = (props) => {
  return (
    <ConnectedRouter history={props.history}>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/redux">Redux</Link>
          </li>
        </ul>
        <Route exact path="/" component={Home} />
        <Route path="/redux" component={ReduxGrid} />
      </div>
    </ConnectedRouter>
  );
};

export default App;

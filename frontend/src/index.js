import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Router } from '@reach/router';
import App from './App';
import AddPage from './AddPage';
import uuid from 'uuid/v4';
import * as serviceWorker from './serviceWorker';
import qs from 'query-string';

const queryString = qs.parse(window.location.search);

const masterId = (function() {
  if (queryString.masterId) {
    return queryString.masterId;
  }

  return uuid();
})();

const render = ({ masterId }) => {
  ReactDOM.render(
    <Router>
      <App path="/" masterId={masterId} />
      <AddPage path="/add/:masterId" />
    </Router>,
    document.getElementById('root')
  );
};

render({ masterId });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';

import { Router } from '@reach/router';
import uuid from 'uuid/v4';
import qs from 'query-string';
import App from './components/App';
import AddPage from './components/AddPage';

const queryString = qs.parse(window.location.search);

const masterId = (function() {
  if (queryString.masterId) {
    return queryString.masterId;
  }

  return uuid();
})();

const debug = (function() {
  if (queryString.debug) {
    return true;
  }

  return false;
})();

ReactDOM.render(
  <Router>
    <App path="/" masterId={masterId} debug={debug} />
    <AddPage path="/add/:masterId" />
  </Router>,
  document.getElementById('root')
);

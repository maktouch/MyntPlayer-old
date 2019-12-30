import 'normalize.css';
import uuid from 'uuid/v4';
import qs from 'query-string';

import App from './App.svelte';
import { queue as store } from './store';
import WS from './lib/WS';

const queryString = qs.parse(window.location.search);

const masterId = (function() {
  if (queryString.masterId) {
    return queryString.masterId;
  }

  return uuid();
})();

const slave = false;

window.history.replaceState({}, document.title, `${window.document.location.pathname}?masterId=${masterId}`);

if (slave) {
  WS.emit('state-request', { masterId });
  WS.on(`${masterId}:sync`, function({ state = [] }) {
    store.set(state);
  });
} else {
}

const app = new App({
  target: document.body,
  props: {
    masterId,
  },
});

export default app;

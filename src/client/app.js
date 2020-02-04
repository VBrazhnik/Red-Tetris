import React from 'react';
import ReactDom from 'react-dom';
import { store } from './store';
import { Provider } from 'react-redux';
import { App } from './containers/app';
import { parseUrl } from './url';
import { stateListener, keyPressListener } from './listeners';
import { joinRoom } from './actions';
import { isUndefined, debounce } from 'lodash';

const { roomName, playerName } = parseUrl(window.location.href);

if (!isUndefined(roomName) && !isUndefined(playerName)) {
  store.dispatch(joinRoom(roomName, playerName));
}

store.subscribe(stateListener);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('tetris')
);

document.addEventListener('keydown', debounce(keyPressListener, 150, { maxWait: 150 }));

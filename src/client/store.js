import io from 'socket.io-client';
import { applyMiddleware, createStore } from 'redux';
import { reducer } from './reducers';
import { socketMiddleware } from './middlewares/socket-middleware';
import { bouncerMiddleWare } from './middlewares/bouncer-middleware';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const socket = io.connect();

const store = createStore(
  reducer,
  applyMiddleware(thunk, socketMiddleware(socket), bouncerMiddleWare, logger)
);

export { store };

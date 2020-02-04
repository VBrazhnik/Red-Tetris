import http from 'http';
import SocketIo from 'socket.io';
import { httpRequestHandler } from './endpoints/http-endpoints';
import { setupWebSocketEndpoints } from './endpoints/websocket-endpoints';

const app = http.createServer(httpRequestHandler);
const io = new SocketIo(app, {
  pingTimeout: 60000,
  pingInterval: 5000,
});

setupWebSocketEndpoints(io);

export { app };

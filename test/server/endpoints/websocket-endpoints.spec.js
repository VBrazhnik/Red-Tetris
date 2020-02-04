import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import { config } from '../../../src/server/config';
import io from 'socket.io-client';
import { app } from '../../../src/server/app';
import * as incomingEventType from '../../../src/server/constants/incoming-event-types';
import * as outgoingEventType from '../../../src/server/constants/outgoing-event-types';

describe('Websocket Endpoints', function() {
  let server;

  beforeEach(function(done) {
    server = app.listen(config.port, config.host, () => done());
  });

  afterEach(function(done) {
    server.close();
    done();
  });

  it('Should return a state after joining the room', function(done) {
    const socket = io(config.url);
    socket.emit(incomingEventType.JOIN_ROOM, { roomName: 'room-1', playerName: 'player-1' });
    socket.on(outgoingEventType.UPDATE_STATE, state => {
      expect(state).to.have.all.keys(
        'id',
        'name',
        'isAdmin',
        'status',
        'score',
        'board',
        'gameStatus',
        'playersList'
      );
      done();
    });
  });

  it('Should return a state after starting the game', function(done) {
    const socket = io(config.url);
    socket.emit(incomingEventType.JOIN_ROOM, { roomName: 'room-1', playerName: 'player-1' });
    socket.on(outgoingEventType.UPDATE_STATE, () => {
      socket.emit(incomingEventType.START_GAME);
      socket.on(outgoingEventType.UPDATE_STATE, state => {
        expect(state).to.have.all.keys(
          'status',
          'activePiece',
          'nextPieces',
          'gameStatus',
          'playersList'
        );
        done();
      });
    });
  });
});

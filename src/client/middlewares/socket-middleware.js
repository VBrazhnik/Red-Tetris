import * as incomingEventType from '../constants/incoming-event-types';
import * as outgoingEventType from '../constants/outgoing-event-types';
import { addBlockedRows, updateState } from '../actions';
import { NotificationManager } from 'react-notifications';

const socketMiddleware = socket => {
  return ({ dispatch }) => {
    socket.on(incomingEventType.UPDATE_STATE, state => {
      dispatch(updateState(state));
    });

    socket.on(incomingEventType.ADD_BLOCKED_ROWS, ({ numberOfBlockedRows, status, board }) => {
      dispatch(addBlockedRows(numberOfBlockedRows, { status, board }));
    });

    socket.on(incomingEventType.USER_ERROR, state => {
      NotificationManager.warning(state.message, null, 5000);
    });

    return next => action => {
      if (action.outgoing) {
        switch (action.type) {
          case outgoingEventType.JOIN_ROOM: {
            const { roomName, playerName } = action;
            socket.emit(outgoingEventType.JOIN_ROOM, { roomName, playerName });
            break;
          }

          case outgoingEventType.START_GAME: {
            socket.emit(outgoingEventType.START_GAME);
            break;
          }

          case outgoingEventType.PUT_PIECE: {
            socket.emit(outgoingEventType.PUT_PIECE, action.piece);
            break;
          }

          case outgoingEventType.FINISH_GAME: {
            socket.emit(outgoingEventType.FINISH_GAME);
            break;
          }

          case outgoingEventType.RESET_GAME: {
            socket.emit(outgoingEventType.RESET_GAME);
            break;
          }
        }

        return;
      }

      return next(action);
    };
  };
};

export { socketMiddleware };

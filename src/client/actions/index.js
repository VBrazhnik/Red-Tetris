import * as actionType from '../constants/action-types';

const updateState = state => ({
  type: actionType.UPDATE_STATE,
  state,
});

const addBlockedRows = (numberOfBlockedRows, state) => ({
  type: actionType.ADD_BLOCKED_ROWS,
  numberOfBlockedRows,
  state,
});

const rotatePiece = () => ({
  type: actionType.ROTATE_PIECE,
});

const movePieceRight = () => ({
  type: actionType.MOVE_PIECE_RIGHT,
});

const movePieceDown = () => ({
  type: actionType.MOVE_PIECE_DOWN,
});

const movePieceLeft = () => ({
  type: actionType.MOVE_PIECE_LEFT,
});

const dropPieceDown = () => ({
  type: actionType.DROP_PIECE_DOWN,
});

const joinRoom = (roomName, playerName) => ({
  type: actionType.JOIN_ROOM,
  outgoing: true,
  roomName,
  playerName,
});

const startGame = () => ({
  type: actionType.START_GAME,
  outgoing: true,
});

const putPiece = piece => ({
  type: actionType.PUT_PIECE,
  outgoing: true,
  piece,
});

const finishGame = () => ({
  type: actionType.FINISH_GAME,
  outgoing: true,
});

const resetGame = () => ({
  type: actionType.RESET_GAME,
  outgoing: true,
});

export {
  updateState,
  addBlockedRows,
  rotatePiece,
  movePieceRight,
  movePieceDown,
  movePieceLeft,
  dropPieceDown,
  joinRoom,
  startGame,
  putPiece,
  finishGame,
  resetGame,
};

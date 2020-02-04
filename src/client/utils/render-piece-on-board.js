import { EMPTY, FILLED } from '../constants/cell-types';
import { cloneDeep as clone, isUndefined } from 'lodash';

const renderPieceOnBoard = (piece, board) => {
  const newBoard = clone(board);
  for (let y = 0; y < piece.blocks.length; y++) {
    for (let x = 0; x < piece.blocks[0].length; x++) {
      if (piece.blocks[y][x] === FILLED) {
        if (
          isUndefined(board[piece.y + y]) ||
          isUndefined(board[piece.y + y][piece.x + x]) ||
          board[piece.y + y][piece.x + x] !== EMPTY
        ) {
          return;
        }
        newBoard[piece.y + y][piece.x + x] = piece.blocks[y][x];
      }
    }
  }
  return newBoard;
};

export { renderPieceOnBoard };

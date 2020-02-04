import * as actionType from '../constants/action-types';
import { PLAYING } from '../constants/player-statuses';
import { FALLING, PLACED, CANNOT_BE_PLACED } from '../constants/piece-statuses';
import { rotatePiece } from '../utils/rotate-piece';
import { movePieceRight } from '../utils/move-piece-right';
import { movePieceDown } from '../utils/move-piece-down';
import { movePieceLeft } from '../utils/move-piece-left';
import { renderPieceOnBoard } from '../utils/render-piece-on-board';
import { movePieceUp } from '../utils/move-piece-up';
import { isUndefined, cloneDeep as clone } from 'lodash';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.UPDATE_STATE: {
      const newState = Object.assign(clone(state), action.state);

      if (newState.board) {
        let renderedBoard;

        if (
          newState.status === PLAYING &&
          newState.activePiece &&
          newState.activePiece.status === FALLING
        ) {
          renderedBoard = renderPieceOnBoard(newState.activePiece, newState.board);
          if (isUndefined(renderedBoard)) {
            newState.activePiece.status = CANNOT_BE_PLACED;
            renderedBoard = clone(newState.board);
          }
        } else {
          renderedBoard = clone(newState.board);
        }
        Object.assign(newState, { renderedBoard });
      }

      return newState;
    }

    case actionType.ADD_BLOCKED_ROWS: {
      if (action.state.status === PLAYING) {
        const activePiece = movePieceUp(state.activePiece, action.numberOfBlockedRows);

        let renderedBoard = renderPieceOnBoard(activePiece, action.state.board);
        if (isUndefined(renderedBoard)) {
          activePiece.status = CANNOT_BE_PLACED;
          renderedBoard = clone(action.state.board);
        }

        return Object.assign(clone(state), action.state, {
          renderedBoard,
          activePiece,
        });
      } else {
        const { activePiece } = state;

        return Object.assign(clone(state), {
          activePiece: Object.assign(clone(activePiece), {
            status: activePiece.status === FALLING ? CANNOT_BE_PLACED : activePiece.status,
          }),
          status: action.state.status,
          board: action.state.board,
          renderedBoard: clone(action.state.board),
        });
      }
    }

    case actionType.ROTATE_PIECE: {
      const activePiece = rotatePiece(state.activePiece);
      const renderedBoard = renderPieceOnBoard(activePiece, state.board);

      if (isUndefined(renderedBoard)) {
        return state;
      }

      return Object.assign(clone(state), {
        activePiece,
        renderedBoard,
      });
    }

    case actionType.MOVE_PIECE_RIGHT: {
      const activePiece = movePieceRight(state.activePiece);
      const renderedBoard = renderPieceOnBoard(activePiece, state.board);

      if (isUndefined(renderedBoard)) {
        return state;
      }

      return Object.assign(clone(state), {
        activePiece,
        renderedBoard,
      });
    }

    case actionType.MOVE_PIECE_DOWN: {
      const activePiece = movePieceDown(state.activePiece);
      const renderedBoard = renderPieceOnBoard(activePiece, state.board);

      if (isUndefined(renderedBoard)) {
        return Object.assign(clone(state), {
          activePiece: Object.assign(clone(state.activePiece), {
            status: PLACED,
          }),
        });
      }

      return Object.assign(clone(state), {
        activePiece,
        renderedBoard,
      });
    }

    case actionType.MOVE_PIECE_LEFT: {
      const activePiece = movePieceLeft(state.activePiece);
      const renderedBoard = renderPieceOnBoard(activePiece, state.board);

      if (isUndefined(renderedBoard)) {
        return state;
      }

      return Object.assign(clone(state), {
        activePiece,
        renderedBoard,
      });
    }

    case actionType.DROP_PIECE_DOWN: {
      let { activePiece, renderedBoard } = state;
      let nextActivePiece = movePieceDown(state.activePiece);
      let nextRenderedBoard = renderPieceOnBoard(nextActivePiece, state.board);

      while (!isUndefined(nextRenderedBoard)) {
        activePiece = nextActivePiece;
        renderedBoard = nextRenderedBoard;
        nextActivePiece = movePieceDown(activePiece);
        nextRenderedBoard = renderPieceOnBoard(nextActivePiece, state.board);
      }

      activePiece.status = PLACED;
      return Object.assign(clone(state), {
        activePiece,
        renderedBoard,
      });
    }

    default: {
      return state;
    }
  }
};

export { reducer };

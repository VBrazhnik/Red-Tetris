import { describe, it } from 'mocha';
import { expect } from 'chai';

import * as playerStatus from '../../../src/client/constants/player-statuses';
import * as pieceStatus from '../../../src/client/constants/piece-statuses';
import * as actionType from '../../../src/client/constants/action-types';
import { reducer } from '../../../src/client/reducers';
import { EMPTY as O, FILLED as X, BLOCKED as B } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('Reducers', function() {
  function getState(state) {
    return Object.assign(
      {
        status: playerStatus.PLAYING,
        activePiece: {
          status: pieceStatus.FALLING,
          x: 0,
          y: 0,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
        board: [
          [O, O, O, O],
          [O, O, O, O],
          [O, O, O, O],
          [O, X, X, X],
          [O, X, X, X],
        ],
      },
      state
    );
  }

  describe('#addBlockedRows', function() {
    it('Should return updated state if blocked rows can be added freely', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: 0,
          y: 1,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
      });

      expect(
        reducer(state, {
          type: actionType.ADD_BLOCKED_ROWS,
          numberOfBlockedRows: 1,
          state: {
            status: playerStatus.PLAYING,
            board: [
              [O, O, O, O],
              [O, O, O, O],
              [O, X, X, X],
              [O, X, X, X],
              [B, B, B, B],
            ],
          },
        })
      ).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.FALLING,
            x: 0,
            y: 0,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          board: [
            [O, O, O, O],
            [O, O, O, O],
            [O, X, X, X],
            [O, X, X, X],
            [B, B, B, B],
          ],
          renderedBoard: [
            [O, X, O, O],
            [X, X, X, O],
            [O, X, X, X],
            [O, X, X, X],
            [B, B, B, B],
          ],
        })
      );
    });

    it('Should return updated state if after blocked rows addition there is no room for the piece', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: 0,
          y: 1,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
      });

      expect(
        reducer(state, {
          type: actionType.ADD_BLOCKED_ROWS,
          numberOfBlockedRows: 2,
          state: {
            status: playerStatus.PLAYING,
            board: [
              [O, O, O, O],
              [O, X, X, X],
              [O, X, X, X],
              [B, B, B, B],
              [B, B, B, B],
            ],
          },
        })
      ).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.CANNOT_BE_PLACED,
            x: 0,
            y: 0,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          board: [
            [O, O, O, O],
            [O, X, X, X],
            [O, X, X, X],
            [B, B, B, B],
            [B, B, B, B],
          ],
          renderedBoard: [
            [O, O, O, O],
            [O, X, X, X],
            [O, X, X, X],
            [B, B, B, B],
            [B, B, B, B],
          ],
        })
      );
    });
  });

  describe('#rotatePiece', function() {
    it('Should return updated state if the piece rotation is possible', function() {
      const state = getState();

      expect(reducer(state, { type: actionType.ROTATE_PIECE })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.FALLING,
            x: 0,
            y: 0,
            blocks: [
              [O, X, O],
              [O, X, X],
              [O, X, O],
            ],
          },
          renderedBoard: [
            [O, X, O, O],
            [O, X, X, O],
            [O, X, O, O],
            [O, X, X, X],
            [O, X, X, X],
          ],
        })
      );
    });

    it('Should return not-updated state if the piece rotation is not possible', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: -1,
          y: 0,
          blocks: [
            [O, X, O],
            [O, X, X],
            [O, X, O],
          ],
        },
      });

      expect(reducer(state, { type: actionType.ROTATE_PIECE })).to.be.deep.equal(state);
    });
  });

  describe('#movePieceRight', function() {
    it('Should return updated state if the piece movement to right is possible', function() {
      const state = getState();

      expect(reducer(state, { type: actionType.MOVE_PIECE_RIGHT })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.FALLING,
            x: 1,
            y: 0,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          renderedBoard: [
            [O, O, X, O],
            [O, X, X, X],
            [O, O, O, O],
            [O, X, X, X],
            [O, X, X, X],
          ],
        })
      );
    });

    it('Should return not-updated state if the piece movement to right is not possible', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: 1,
          y: 0,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
      });

      expect(reducer(state, { type: actionType.MOVE_PIECE_RIGHT })).to.be.deep.equal(state);
    });
  });

  describe('#movePieceLeft', function() {
    it('Should return updated state if the piece movement to left is possible', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: 1,
          y: 0,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
      });

      expect(reducer(state, { type: actionType.MOVE_PIECE_LEFT })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.FALLING,
            x: 0,
            y: 0,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          renderedBoard: [
            [O, X, O, O],
            [X, X, X, O],
            [O, O, O, O],
            [O, X, X, X],
            [O, X, X, X],
          ],
        })
      );
    });

    it('Should return not-updated state if the piece movement to left is not possible', function() {
      const state = getState();

      expect(reducer(state, { type: actionType.MOVE_PIECE_LEFT })).to.be.deep.equal(state);
    });
  });

  describe('#movePieceDown', function() {
    it('Should return updated state if the piece movement to down is possible', function() {
      const state = getState();

      expect(reducer(state, { type: actionType.MOVE_PIECE_DOWN })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.FALLING,
            x: 0,
            y: 1,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          renderedBoard: [
            [O, O, O, O],
            [O, X, O, O],
            [X, X, X, O],
            [O, X, X, X],
            [O, X, X, X],
          ],
        })
      );
    });

    it('Should return updated state with changed the status of the piece to "placed"', function() {
      const state = getState({
        activePiece: {
          status: pieceStatus.FALLING,
          x: 1,
          y: 2,
          blocks: [
            [O, X, O],
            [X, X, X],
            [O, O, O],
          ],
        },
      });

      expect(reducer(state, { type: actionType.MOVE_PIECE_DOWN })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.PLACED,
            x: 1,
            y: 2,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
        })
      );
    });
  });

  describe('#dropPieceDown', function() {
    it('Should return updated state', function() {
      const state = getState();

      expect(reducer(state, { type: actionType.DROP_PIECE_DOWN })).to.be.deep.equal(
        Object.assign(clone(state), {
          activePiece: {
            status: pieceStatus.PLACED,
            x: 0,
            y: 1,
            blocks: [
              [O, X, O],
              [X, X, X],
              [O, O, O],
            ],
          },
          renderedBoard: [
            [O, O, O, O],
            [O, X, O, O],
            [X, X, X, O],
            [O, X, X, X],
            [O, X, X, X],
          ],
        })
      );
    });
  });
});

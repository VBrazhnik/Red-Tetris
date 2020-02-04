import { describe, it } from 'mocha';
import { expect } from 'chai';

import { renderPieceOnBoard } from '../../../src/client/utils/render-piece-on-board';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Place piece on board', function() {
  it('Should return a board with a placed piece', function() {
    const piece = {
      x: 0,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    const board = [
      [O, O, O, O],
      [O, O, O, O],
      [O, O, O, O],
      [O, X, X, X],
      [O, X, X, X],
    ];

    expect(renderPieceOnBoard(piece, board)).to.be.deep.equal([
      [O, O, O, O],
      [O, X, O, O],
      [X, X, X, O],
      [O, X, X, X],
      [O, X, X, X],
    ]);
  });

  it('Should return "undefined" if a place cannot be placed on a board', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    const board = [
      [O, O, O, O],
      [O, O, O, O],
      [O, X, O, O],
      [O, X, X, X],
      [O, X, X, X],
    ];

    expect(renderPieceOnBoard(piece, board)).to.be.undefined;
  });
});

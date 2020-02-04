import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Board } from '../../../src/server/models/board';
import { GameError } from '../../../src/server/errors/game-error';
import { EMPTY as O, FILLED as X, BLOCKED as B } from '../../../src/server/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('Board', function() {
  const rows = 5;
  const columns = 4;

  const blocks = [
    [O, O, O, O],
    [O, O, O, O],
    [O, X, X, O],
    [O, O, X, O],
    [O, O, X, O],
  ];

  describe('#constructor()', function() {
    it('Should return an object with all required properties', function() {
      const board = new Board(rows, columns);

      expect(board).to.have.all.keys('blocks');
      expect(board.blocks).to.be.deep.equal([
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
      ]);
    });
  });

  describe('#getSpectrum()', function() {
    it('Should return a spectrum of board', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      expect(board.getSpectrum()).to.be.deep.equal([
        [O, O, O, O],
        [O, O, O, O],
        [O, X, X, O],
        [O, X, X, O],
        [O, X, X, O],
      ]);
    });
  });

  describe('#canPutPiece()', function() {
    it('Should return "true" if a piece can be put', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      const piece = {
        x: 0,
        y: 0,
        blocks: [
          [O, X, O],
          [X, X, X],
          [O, O, O],
        ],
      };

      expect(board.canPutPiece(piece)).to.be.true;
    });

    it('Should return "false" if a piece cannot be put', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      const piece = {
        x: 0,
        y: 1,
        blocks: [
          [O, X, O],
          [X, X, X],
          [O, O, O],
        ],
      };

      expect(board.canPutPiece(piece)).to.be.false;
    });
  });

  describe('#putPiece()', function() {
    it('Should put a piece if it can be put', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      const piece = {
        x: 0,
        y: 0,
        blocks: [
          [O, X, O],
          [X, X, X],
          [O, O, O],
        ],
      };

      board.putPiece(piece);

      expect(board.blocks).to.be.deep.equal([
        [O, X, O, O],
        [X, X, X, O],
        [O, X, X, O],
        [O, O, X, O],
        [O, O, X, O],
      ]);
    });

    it('Should throw an error if a piece cannot be put', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      const piece = {
        x: 0,
        y: 1,
        blocks: [
          [O, X, O],
          [X, X, X],
          [O, O, O],
        ],
      };

      expect(() => board.putPiece(piece)).to.throw(GameError);
    });
  });

  describe('#countFilledRows()', function() {
    it('Should return a count of filled rows', function() {
      const board = new Board(rows, columns);

      board.blocks = [
        [O, O, O, O],
        [O, O, O, O],
        [O, X, X, O],
        [X, X, X, X],
        [O, O, X, O],
      ];

      expect(board.countFilledRows()).to.be.equal(1);
    });
  });

  describe('#clearBoard()', function() {
    it('Should clear a board', function() {
      const board = new Board(rows, columns);

      board.blocks = [
        [O, O, O, O],
        [O, O, O, O],
        [O, X, X, O],
        [X, X, X, X],
        [O, O, X, O],
      ];

      board.clearBoard();

      expect(board.blocks).to.be.deep.equal([
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
        [O, X, X, O],
        [O, O, X, O],
      ]);
    });
  });

  describe('#canAddBlockedRows()', function() {
    it('Should return "true" if a specified number of blocked rows can be added', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      expect(board.canAddBlockedRows(2)).to.be.true;
    });

    it('Should return "false" if a specified number of blocked rows cannot be added', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      expect(board.canAddBlockedRows(3)).to.be.false;
    });
  });

  describe('#addBlockedRows()', function() {
    it('Should add blocked rows if there is enough space', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      board.addBlockedRows(1);

      expect(board.blocks).to.be.deep.equal([
        [O, O, O, O],
        [O, X, X, O],
        [O, O, X, O],
        [O, O, X, O],
        [B, B, B, B],
      ]);
    });

    it('Should add blocked rows if there is not enough space', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      board.addBlockedRows(3);

      expect(board.blocks).to.be.deep.equal([
        [O, O, X, O],
        [O, O, X, O],
        [B, B, B, B],
        [B, B, B, B],
        [B, B, B, B],
      ]);
    });
  });

  describe('#reset()', function() {
    it('Should make a board empty', function() {
      const board = new Board(rows, columns);

      board.blocks = clone(blocks);

      board.reset();

      expect(board.blocks).to.be.deep.equal([
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
        [O, O, O, O],
      ]);
    });
  });
});

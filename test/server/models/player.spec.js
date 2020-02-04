import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Player } from '../../../src/server/models/player';
import { Piece } from '../../../src/server/models/piece';
import { GameError } from '../../../src/server/errors/game-error';
import { WAITING, FINISHED } from '../../../src/server/constants/player-statuses';
import { EMPTY as O, FILLED as X } from '../../../src/server/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('Player', function() {
  const id = 'id-1';
  const name = 'player-1';
  const boardConfig = { rows: 5, columns: 4 };

  describe('#constructor()', function() {
    it('Should return an object with all required properties', function() {
      const player = new Player(id, name, boardConfig);

      expect(player).to.have.all.keys(
        'id',
        'name',
        'roomName',
        'isAdmin',
        'status',
        'score',
        'pieces',
        'placedPiecesCount',
        'board'
      );

      expect(player.id)
        .to.be.a('string')
        .that.is.equal(id);
      expect(player.name)
        .to.be.a('string')
        .that.is.equal(name);
      expect(player.roomName).to.be.a('null');
      expect(player.isAdmin).to.be.a('boolean').which.is.false;
      expect(player.status)
        .to.be.a('string')
        .that.is.equal(WAITING);
      expect(player.score)
        .to.be.a('number')
        .that.is.equal(0);
      expect(player.pieces).to.be.an('array').which.is.empty;
      expect(player.board)
        .to.have.property('blocks')
        .which.is.an('array');
    });
  });

  describe('#addPieces()', function() {
    it('Should add pieces', function() {
      const player = new Player(id, name, boardConfig);

      expect(player.pieces).to.be.empty;

      player.addPieces(Piece.generatePieces(10));

      expect(player.pieces).to.have.lengthOf(10);
    });

    it('Should index added pieces', function() {
      const player = new Player(id, name, boardConfig);

      player.addPieces(Piece.generatePieces(10));

      player.pieces.forEach(piece =>
        expect(piece)
          .to.have.property('index')
          .which.is.a('number')
          .at.least(0)
          .and.satisfies(Number.isInteger)
      );
    });
  });

  describe('#get activePiece()', function() {
    it('Should return an active piece if it is present', function() {
      const player = new Player(id, name, boardConfig);

      const piece = new Piece();
      player.addPieces([piece]);

      expect(player.activePiece).to.have.all.keys('index', 'status', 'x', 'y', 'blocks');
    });

    it('Should return "undefined" if an active piece is not present', function() {
      const player = new Player(id, name, boardConfig);

      expect(player.activePiece).to.be.undefined;
    });
  });

  describe('#get nextPieces()', function() {
    it('Should return next pieces', function() {
      const player = new Player(id, name, boardConfig);

      expect(player.getNextPieces(3)).to.be.empty;

      player.addPieces(Piece.generatePieces(10));

      expect(player.getNextPieces(3)).to.have.length(3);
    });
  });

  describe('#updateActivePiece()', function() {
    it('Should update an active piece', function() {
      const player = new Player(id, name, boardConfig);

      const [firstPiece, secondPiece, thirdPiece] = Piece.generatePieces(3);
      player.addPieces([firstPiece, secondPiece, thirdPiece]);

      expect(player.activePiece)
        .to.have.property('index')
        .which.is.equal(0);

      player.updateActivePiece();

      expect(player.placedPiecesCount).to.be.equal(1);
      expect(player.activePiece)
        .to.have.property('index')
        .which.is.equal(1);
    });

    it('Should not update an active piece if there are no pieces', function() {
      const player = new Player(id, name, boardConfig);

      expect(player.placedPiecesCount).to.be.equal(0);
      player.updateActivePiece();
      expect(player.placedPiecesCount).to.be.equal(0);
    });
  });

  describe('#putPiece()', function() {
    it('Should put piece on board and update score, active piece', function() {
      const player = new Player(id, name, { rows: 5, columns: 5 });
      const initialState = clone(player.board);

      const [firstPiece, secondPiece] = Piece.generatePieces(2);
      player.addPieces([firstPiece, secondPiece]);

      expect(player.putPiece(firstPiece))
        .to.be.a('number')
        .which.satisfies(Number.isInteger);
      expect(player.board).to.be.not.deep.equal(initialState);
      expect(player.activePiece)
        .to.have.property('index')
        .which.is.equal(1);
    });

    it('Should throw an error if piece cannot be placed', function() {
      const player = new Player(id, name, { rows: 5, columns: 1 });

      const [firstPiece, secondPiece] = Piece.generatePieces(2);
      player.addPieces([firstPiece, secondPiece]);

      expect(() => player.putPiece(firstPiece)).to.throw(GameError);
    });
  });

  describe('#reset()', function() {
    it('Should reset player properties', function() {
      const player = new Player(id, name, boardConfig);
      const initialPlayerState = clone(player);

      player.status = FINISHED;
      player.score = 100;
      player.addPieces(Piece.generatePieces(10));
      player.board.blocks = [
        [O, O, O, O],
        [O, X, O, X],
        [O, X, X, O],
        [X, X, X, O],
        [O, O, X, O],
      ];

      expect(player).to.be.not.deep.equal(initialPlayerState);

      player.reset();

      expect(player).to.be.deep.equal(initialPlayerState);
    });
  });
});

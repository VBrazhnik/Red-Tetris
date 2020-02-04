import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Game } from '../../../src/server/models/game';
import { Player } from '../../../src/server/models/player';
import { Piece } from '../../../src/server/models/piece';
import { UserError } from '../../../src/server/errors/user-error';
import { PENDING, RUNNING, COMPLETED } from '../../../src/server/constants/game-statuses';
import { WAITING, PLAYING, FINISHED, LEFT } from '../../../src/server/constants/player-statuses';

describe('Game', function() {
  const roomName = 'room-1';
  const boardConfig = { rows: 5, columns: 4 };

  function getPlayer(index) {
    return new Player(`id-${index}`, `player-${index}`, boardConfig);
  }

  describe('#constructor()', function() {
    it('Should return an object with all required properties', function() {
      const game = new Game(roomName);

      expect(game).to.have.all.keys('roomName', 'players');

      expect(game.roomName)
        .to.be.a('string')
        .that.is.equal(roomName);
      expect(game.players).to.be.an('array').that.is.empty;
    });
  });

  describe('#isEmpty()', function() {
    it('Should return "true" if there are no players in a room', function() {
      const game = new Game(roomName);

      expect(game.isEmpty()).to.be.true;
    });

    it('Should return "true" if there are no active players in a room', function() {
      const game = new Game(roomName);

      const player = getPlayer(1);

      game.players = [player];
      player.status = LEFT;

      expect(game.isEmpty()).to.be.true;
    });

    it('Should return "false" if there are active players in a room', function() {
      const game = new Game(roomName);

      const player = getPlayer(1);

      game.players = [player];

      expect(game.isEmpty()).to.be.false;
    });
  });

  describe('#get status()', function() {
    it('Should return pending status if there are no players in a room', function() {
      const game = new Game(roomName);

      expect(game.status).to.be.equal(PENDING);
    });

    it('Should return pending status if a game is not started', function() {
      const game = new Game(roomName);
      const player = getPlayer(1);

      game.players = [player];

      expect(game.status).to.be.equal(PENDING);
    });

    it('Should return running status if a few players did not finish a game', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.players = [firstPlayer, secondPlayer];
      firstPlayer.status = PLAYING;
      secondPlayer.status = FINISHED;

      expect(game.status).to.be.equal(RUNNING);
    });

    it('Should return finished status if all players finished a game', function() {
      const game = new Game(roomName);

      const player = getPlayer(1);

      game.players = [player];
      player.status = FINISHED;

      expect(game.status).to.be.equal(COMPLETED);
    });
  });

  describe('#get admin()', function() {
    it('Should return "undefined" if there is no admin in a room', function() {
      const game = new Game(roomName);

      expect(game.admin).to.be.undefined;
    });

    it('Should return an admin of a game if it presents in a room', function() {
      const game = new Game(roomName);

      const player = getPlayer(1);
      player.isAdmin = true;
      game.players = [player];

      expect(game.admin).to.be.deep.equal(player);
    });
  });

  describe('#assignAdmin()', function() {
    it('Should assign admin rights for one of the active players', function() {
      const game = new Game(roomName);

      const player = getPlayer(1);
      game.players = [player];

      expect(game.admin).to.be.undefined;
      game.assignAdmin();
      expect(game.admin).to.have.property('id', player.id);
    });
  });

  describe('#get activePlayers()', function() {
    it('Should return all players if a game is not started', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);

      expect(game.activePlayers).to.have.length(2);
    });

    it('Should return players which have status different from "left" if a game is started', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);

      game.start();

      game.disconnectPlayer(firstPlayer);

      expect(game.activePlayers).to.have.length(1);
    });
  });

  describe('#getParticipants()', function() {
    it('Should return players list', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer, thirdPlayer] = [getPlayer(1), getPlayer(2), getPlayer(3)];

      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);
      game.connectPlayer(thirdPlayer);

      game.getPlayersList().forEach(player => {
        expect(player).to.have.all.keys(
          'position',
          'id',
          'name',
          'status',
          'score',
          'boardSpectrum'
        );
      });
    });
  });

  describe('#connectPlayer()', function() {
    it('Should connect player if a game is not started', function() {
      const game = new Game(roomName);

      expect(game.players).to.be.empty;

      game.connectPlayer(getPlayer(1));

      expect(game.players).to.have.length(1);
    });

    it('Should throw an error for player connection if a game was started', function() {
      const game = new Game(roomName);

      game.connectPlayer(getPlayer(1));

      game.start();

      expect(() => game.connectPlayer(getPlayer(1))).to.throw(UserError);
    });
  });

  describe('#disconnectPlayer()', function() {
    it('Should remove player from a list if a game is not started', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer, thirdPlayer] = [getPlayer(1), getPlayer(2), getPlayer(3)];

      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);
      game.connectPlayer(thirdPlayer);

      expect(game.players).to.have.length(3);

      game.disconnectPlayer(firstPlayer);

      expect(game.players).to.have.length(2);
    });

    it('Should change status of the player if a game is in progress', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer, thirdPlayer] = [getPlayer(1), getPlayer(2), getPlayer(3)];

      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);
      game.connectPlayer(thirdPlayer);

      game.start();

      expect(game.players).to.have.length(3);

      game.disconnectPlayer(firstPlayer);

      expect(game.players).to.have.length(3);
      expect(firstPlayer.status).to.be.equal(LEFT);
    });
  });

  describe('#start()', function() {
    it('Should start a game', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.players = [firstPlayer, secondPlayer];

      expect(firstPlayer.status).to.be.equal(WAITING);
      expect(secondPlayer.status).to.be.equal(WAITING);

      game.start();

      expect(firstPlayer.status).to.be.equal(PLAYING);
      expect(secondPlayer.status).to.be.equal(PLAYING);
    });

    it('Should throw an error if a game was already started', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.players = [firstPlayer, secondPlayer];

      game.start();

      expect(() => game.start()).to.throw(UserError);
    });
  });

  describe('#reset()', function() {
    it('Should reset a game if all players finished it', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer, thirdPlayer] = [getPlayer(1), getPlayer(2), getPlayer(3)];

      game.players = [firstPlayer, secondPlayer, thirdPlayer];

      firstPlayer.status = FINISHED;
      secondPlayer.status = LEFT;
      thirdPlayer.status = FINISHED;

      expect(game.players).have.length(3);

      game.reset();

      expect(game.players).have.length(2);
    });

    it('Should throw an error if not all players finished a game', function() {
      const game = new Game(roomName);

      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      game.players = [firstPlayer, secondPlayer];
      firstPlayer.status = FINISHED;
      secondPlayer.status = PLAYING;

      expect(() => game.reset()).to.throw(UserError);
    });
  });

  describe('#addPieces()', function() {
    const game = new Game(roomName);

    const player = getPlayer(1);
    game.players = [player];

    expect(player.pieces).to.be.empty;
    game.addPieces(Piece.generatePieces(10));
    expect(player.pieces).to.have.length(10);
  });

  describe('#getNumberOfBlockedRows()', function() {
    it('Should return N - 1 if a number of deleted rows is positive', function() {
      expect(Game.getNumberOfBlockedRows(1)).to.be.equal(0);
      expect(Game.getNumberOfBlockedRows(2)).to.be.equal(1);
      expect(Game.getNumberOfBlockedRows(3)).to.be.equal(2);
      expect(Game.getNumberOfBlockedRows(4)).to.be.equal(3);
    });

    it('Should return zero if a number of deleted rows is not positive', function() {
      expect(Game.getNumberOfBlockedRows(0)).to.be.equal(0);
      expect(Game.getNumberOfBlockedRows(-1)).to.be.equal(0);
    });
  });

  describe('#getScore()', function() {
    it('Should return score for a valid number of deleted rows', function() {
      expect(Game.getScore(0)).to.be.equal(0);
      expect(Game.getScore(1)).to.be.equal(40);
      expect(Game.getScore(2)).to.be.equal(100);
      expect(Game.getScore(3)).to.be.equal(300);
      expect(Game.getScore(4)).to.be.equal(1200);
    });

    it('Should return "undefined" for an invalid number of deleted rows', function() {
      expect(Game.getScore(-1)).to.be.undefined;
      expect(Game.getScore(5)).to.be.undefined;
    });
  });
});

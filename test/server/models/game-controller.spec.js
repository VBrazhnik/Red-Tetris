import { describe, it } from 'mocha';
import { expect } from 'chai';

import { GameController } from '../../../src/server/models/game-controller';
import { Game } from '../../../src/server/models/game';
import { Player } from '../../../src/server/models/player';
import { UserError } from '../../../src/server/errors/user-error';
import { GameError } from '../../../src/server/errors/game-error';

describe('Game Controller', function() {
  const roomName = 'room-1';
  const boardConfig = { rows: 20, columns: 10 };

  function getPlayer(index) {
    return new Player(`id-${index}`, `player-${index}`, boardConfig);
  }

  describe('#constructor()', function() {
    it('Should return an empty board', function() {
      const gameController = new GameController();

      expect(gameController).to.have.all.keys('games');

      expect(gameController.games).to.be.a('map').that.is.empty;
    });
  });

  describe('#addGame()', function() {
    it('Should add a game', function() {
      const gameController = new GameController();

      gameController.addGame(new Game(roomName));

      expect(gameController.games).to.have.length(1);
    });

    it('Should throw an error if a game with this name already exists', function() {
      const gameController = new GameController();

      gameController.addGame(new Game(roomName));

      expect(() => gameController.addGame(new Game(roomName))).to.throw(GameError);
    });
  });

  describe('#isGameExists()', function() {
    it('Should return "true" if a game exists', function() {
      const gameController = new GameController();

      gameController.addGame(new Game(roomName));

      expect(gameController.isGameExists(roomName)).to.be.true;
    });

    it('Should return "false" if a game does not exist', function() {
      const gameController = new GameController();

      expect(gameController.isGameExists(roomName)).to.be.false;
    });
  });

  describe('#getGame()', function() {
    it('Should return a game if it exists', function() {
      const gameController = new GameController();

      const game = new Game(roomName);
      gameController.addGame(game);

      expect(gameController.getGame(roomName)).to.be.deep.equal(game);
    });

    it('Should return "undefined" if it does not exist', function() {
      const gameController = new GameController();

      expect(gameController.getGame(roomName)).to.be.undefined;
    });
  });

  describe('#removeGame()', function() {
    it('Should remove a game', function() {
      const gameController = new GameController();

      gameController.addGame(new Game(roomName));

      expect(gameController.games).to.have.length(1);

      gameController.removeGame(roomName);

      expect(gameController.games).to.be.empty;
    });
  });

  describe('#authPlayer()', function() {
    it('Should return "true" if all requirements were fulfilled', function() {
      const gameController = new GameController();
      const game = new Game(roomName);
      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      gameController.addGame(game);
      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);

      expect(gameController.authPlayer(secondPlayer)).to.be.true;
    });

    it('Should throw an error if a player is "undefined"', function() {
      const gameController = new GameController();
      const game = new Game(roomName);

      gameController.addGame(game);

      expect(() => gameController.authPlayer()).to.throw(UserError);
    });
  });

  describe('#authAdmin()', function() {
    it('Should return "true" if all requirements were fulfilled', function() {
      const gameController = new GameController();
      const game = new Game(roomName);
      const player = getPlayer(1);

      gameController.addGame(game);
      game.connectPlayer(player);

      expect(gameController.authAdmin(player)).to.be.true;
    });

    it('Should throw an error if a player is not admin', function() {
      const gameController = new GameController();
      const game = new Game(roomName);
      const [firstPlayer, secondPlayer] = [getPlayer(1), getPlayer(2)];

      gameController.addGame(game);
      game.connectPlayer(firstPlayer);
      game.connectPlayer(secondPlayer);

      expect(() => gameController.authAdmin(secondPlayer)).to.throw(UserError);
    });
  });
});

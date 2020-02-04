import { UserError } from '../errors/user-error';
import { GameError } from '../errors/game-error';
import { isUndefined } from 'lodash';
import { logger } from '../logger';

class GameController {
  constructor() {
    this.games = new Map();
  }

  addGame(game) {
    if (this.isGameExists(game.roomName)) {
      throw new GameError('The game with this name already exists');
    }

    this.games.set(game.roomName, game);

    logger.info('The room was added', {
      room: game.roomName,
    });
  }

  isGameExists(roomName) {
    return this.games.has(roomName);
  }

  getGame(roomName) {
    return this.games.get(roomName);
  }

  removeGame(roomName) {
    this.games.delete(roomName);

    logger.info('The room was removed', {
      roomName,
    });
  }

  authPlayer(player) {
    if (isUndefined(player) || !this.isGameExists(player.roomName)) {
      throw new UserError('You cannot perform a player command');
    }
    return true;
  }

  authAdmin(player) {
    this.authPlayer(player);
    if (!player.isAdmin) {
      throw new UserError('You cannot perform an admin command');
    }
    return true;
  }
}

export { GameController };

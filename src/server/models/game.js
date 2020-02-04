import { UserError } from '../errors/user-error';
import { PENDING, RUNNING, COMPLETED } from '../constants/game-statuses';
import { WAITING, PLAYING, FINISHED, LEFT } from '../constants/player-statuses';
import { isUndefined } from 'lodash';
import { logger } from '../logger';

class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
  }

  isEmpty() {
    return this.activePlayers.length === 0;
  }

  get status() {
    if (this.players.every(player => player.status === WAITING)) {
      return PENDING;
    } else if (this.players.every(player => player.status === FINISHED || player.status === LEFT)) {
      return COMPLETED;
    } else {
      return RUNNING;
    }
  }

  get admin() {
    return this.players.find(player => player.isAdmin);
  }

  assignAdmin() {
    const admin = this.activePlayers.find(player => !player.isAdmin);
    admin.isAdmin = true;

    logger.info('The player was assigned as admin', {
      player: { id: admin.id, name: admin.name },
      roomName: this.roomName,
    });

    return admin;
  }

  get activePlayers() {
    return this.players.filter(player => player.status !== LEFT);
  }

  getPlayersList() {
    const scores = [...new Set(this.players.map(({ score }) => score))];
    scores.sort((a, b) => b - a);

    return this.players
      .map(player => ({
        position: scores.findIndex(score => score === player.score),
        id: player.id,
        name: player.name,
        status: player.status,
        score: player.score,
        boardSpectrum: player.board.getSpectrum(),
      }))
      .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  }

  connectPlayer(player) {
    if (this.status !== PENDING) {
      throw new UserError(`The game in the room '${this.roomName}' is already running`);
    }

    player.roomName = this.roomName;
    this.players.push(player);
    if (isUndefined(this.admin)) {
      this.assignAdmin();
    }

    logger.info('The player was connected', {
      player: { id: player.id, name: player.name },
      room: this.roomName,
    });
  }

  disconnectPlayer(player) {
    if (this.status === PENDING) {
      this.players = this.players.filter(({ id }) => id !== player.id);
    } else {
      player.status = LEFT;
    }

    if (!this.isEmpty() && player.isAdmin) {
      player.isAdmin = false;

      logger.info('The player lost admin rights', {
        player: { id: player.id, name: player.name },
        roomName: this.roomName,
      });

      this.assignAdmin();
    }

    logger.info('The player was disconnected', {
      player: { id: player.id, name: player.name },
      room: this.roomName,
    });
  }

  start() {
    if (this.status !== PENDING) {
      throw new UserError(`The game in the room '${this.roomName}' is already started`);
    }

    this.players.forEach(player => {
      player.status = PLAYING;
    });

    logger.info('The game was started', {
      room: this.roomName,
    });
  }

  reset() {
    if (this.status !== COMPLETED) {
      throw new UserError(`The game in the room '${this.roomName}' is in progress`);
    }

    this.players = this.players.filter(player => player.status !== LEFT);
    this.players.forEach(player => player.reset());

    logger.info('The game was reset', {
      room: this.roomName,
    });
  }

  addPieces(pieces) {
    this.players.forEach(player => {
      player.addPieces(pieces);
    });

    logger.info('Pieces were added', {
      count: pieces.length,
      room: this.roomName,
    });
  }

  static getNumberOfBlockedRows(numberOfFilledRows) {
    return numberOfFilledRows > 0 ? numberOfFilledRows - 1 : 0;
  }

  static addBlockedRows(players, numberOfBlockedRows) {
    players.forEach(player => {
      player.status = player.board.canAddBlockedRows(numberOfBlockedRows) ? PLAYING : FINISHED;
      player.board.addBlockedRows(numberOfBlockedRows);
    });
  }

  static getScore(numberOfDeletedRows) {
    const scoreMap = {
      0: 0,
      1: 40,
      2: 100,
      3: 300,
      4: 1200,
    };

    return scoreMap[numberOfDeletedRows];
  }
}

export { Game };

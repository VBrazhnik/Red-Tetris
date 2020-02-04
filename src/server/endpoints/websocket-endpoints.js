import { config } from '../config';
import { GameController } from '../models/game-controller';
import { Game } from '../models/game';
import { Player } from '../models/player';
import { Piece } from '../models/piece';
import { UserError } from '../errors/user-error';
import Joi from '@hapi/joi';
import { pieceSchema } from '../schemas/piece';
import * as incomingEventType from '../constants/incoming-event-types';
import * as outgoingEventType from '../constants/outgoing-event-types';
import { PLAYING, FINISHED } from '../constants/player-statuses';
import { isUndefined } from 'lodash';
import { logger } from '../logger';

const gameController = new GameController();

function setupWebSocketEndpoints(io) {
  io.on('connect', socket => {
    let player;

    logger.info('Socket was connected', { id: socket.id });

    socket.once(incomingEventType.JOIN_ROOM, ({ roomName, playerName }) => {
      try {
        Joi.assert(roomName, Joi.string(), { convert: false });
        Joi.assert(playerName, Joi.string(), { convert: false });

        if (!gameController.isGameExists(roomName)) {
          gameController.addGame(new Game(roomName));
        }

        const game = gameController.getGame(roomName);

        player = new Player(socket.id, playerName, config.board);
        game.connectPlayer(player);
        socket.join(roomName);

        const playersList = game.getPlayersList();
        socket.emit(outgoingEventType.UPDATE_STATE, {
          id: player.id,
          name: player.name,
          isAdmin: player.isAdmin,
          status: player.status,
          score: player.score,
          board: player.board.blocks,
          gameStatus: game.status,
          playersList,
        });
        socket.to(player.roomName).emit(outgoingEventType.UPDATE_STATE, { playersList });
      } catch (error) {
        if (error instanceof UserError) {
          socket.emit(outgoingEventType.USER_ERROR, { message: error.message });
        }

        logger.warn(`WebSocket Endpoint: ${incomingEventType.JOIN_ROOM}`, { error: error.message });
      }
    });

    socket.on(incomingEventType.START_GAME, () => {
      try {
        gameController.authAdmin(player);

        const game = gameController.getGame(player.roomName);

        game.start();
        game.addPieces(Piece.generatePieces(config.piecesGeneratingBatch));

        io.in(player.roomName).emit(outgoingEventType.UPDATE_STATE, {
          status: player.status,
          activePiece: player.activePiece,
          nextPieces: player.getNextPieces(config.nextPiecesCount),
          gameStatus: game.status,
          playersList: game.getPlayersList(),
        });
      } catch (error) {
        if (error instanceof UserError) {
          socket.emit(outgoingEventType.USER_ERROR, { message: error.message });
        }

        logger.warn(`WebSocket Endpoint: ${incomingEventType.START_GAME}`, {
          error: error.message,
        });
      }
    });

    socket.on(incomingEventType.PUT_PIECE, piece => {
      try {
        Joi.assert(piece, pieceSchema, { convert: false });

        gameController.authPlayer(player);

        const game = gameController.getGame(player.roomName);

        const numberOfFilledRows = player.putPiece(piece);
        const numberOfBlockedRows = Game.getNumberOfBlockedRows(numberOfFilledRows);
        if (player.pieces.length <= config.nextPiecesCount) {
          game.addPieces(Piece.generatePieces(config.piecesGeneratingBatch));
        }

        const opponents = game.players
          .filter(({ id }) => id !== player.id)
          .filter(({ status }) => status === PLAYING);
        Game.addBlockedRows(opponents, numberOfBlockedRows);

        socket.emit(outgoingEventType.UPDATE_STATE, {
          activePiece: player.activePiece,
          nextPieces: player.getNextPieces(config.nextPiecesCount),
          score: player.score,
          board: player.board.blocks,
        });

        if (numberOfBlockedRows) {
          opponents.forEach(player => {
            io.to(player.id).emit(outgoingEventType.ADD_BLOCKED_ROWS, {
              numberOfBlockedRows,
              status: player.status,
              board: player.board.blocks,
            });
          });

          logger.info('The player produced blocked rows', {
            player: { id: player.id, name: player.name },
            room: player.roomName,
            blockedRows: numberOfBlockedRows,
          });
        }

        io.in(player.roomName).emit(outgoingEventType.UPDATE_STATE, {
          gameStatus: game.status,
          playersList: game.getPlayersList(),
        });
      } catch (error) {
        if (error instanceof UserError) {
          socket.emit(outgoingEventType.USER_ERROR, { message: error.message });
        }

        logger.warn(`WebSocket Endpoint: ${incomingEventType.PUT_PIECE}`, { error: error.message });
      }
    });

    socket.on(incomingEventType.FINISH_GAME, () => {
      try {
        gameController.authPlayer(player);

        const game = gameController.getGame(player.roomName);

        player.status = FINISHED;

        socket.emit(outgoingEventType.UPDATE_STATE, {
          status: player.status,
        });

        io.in(player.roomName).emit(outgoingEventType.UPDATE_STATE, {
          gameStatus: game.status,
          playersList: game.getPlayersList(),
        });
      } catch (error) {
        if (error instanceof UserError) {
          socket.emit(outgoingEventType.USER_ERROR, { message: error.message });
        }

        logger.warn(`WebSocket Endpoint: ${incomingEventType.FINISH_GAME}`, {
          error: error.message,
        });
      }
    });

    socket.on(incomingEventType.RESET_GAME, () => {
      try {
        gameController.authAdmin(player);

        const game = gameController.getGame(player.roomName);

        game.reset();

        io.in(player.roomName).emit(outgoingEventType.UPDATE_STATE, {
          status: player.status,
          score: player.score,
          board: player.board.blocks,
          gameStatus: game.status,
          playersList: game.getPlayersList(),
        });
      } catch (error) {
        if (error instanceof UserError) {
          socket.emit(outgoingEventType.USER_ERROR, {
            message: error.message,
          });
        }

        logger.warn(`WebSocket Endpoint: ${incomingEventType.RESET_GAME}`, {
          error: error.message,
        });
      }
    });

    socket.once('disconnect', () => {
      try {
        if (isUndefined(player)) {
          logger.info('Non-player socket was disconnected', { id: socket.id });
          return;
        }

        gameController.authPlayer(player);

        const game = gameController.getGame(player.roomName);

        const previousAdmin = game.admin;

        game.disconnectPlayer(player);
        socket.leave(player.roomName);

        const admin = game.admin;
        if (admin && previousAdmin.id !== admin.id) {
          io.to(admin.id).emit(outgoingEventType.UPDATE_STATE, {
            isAdmin: admin.isAdmin,
          });
        }

        socket.to(player.roomName).emit(outgoingEventType.UPDATE_STATE, {
          gameStatus: game.status,
          playersList: game.getPlayersList(),
        });

        if (game.isEmpty()) {
          gameController.removeGame(player.roomName);
        }
      } catch (error) {
        logger.warn('WebSocket Endpoint: disconnect', { error: error.message });
      }
    });
  });
}

export { setupWebSocketEndpoints };

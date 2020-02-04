import { Game } from './game';
import { Board } from './board';
import { WAITING } from '../constants/player-statuses';
import { cloneDeep as clone } from 'lodash';

class Player {
  constructor(id, name, { rows, columns }) {
    this.id = id;
    this.name = name;
    this.roomName = null;
    this.isAdmin = false;
    this.status = WAITING;
    this.score = 0;
    this.pieces = [];
    this.placedPiecesCount = 0;
    this.board = new Board(rows, columns);
  }

  addPieces(pieces) {
    const indexedPieces = pieces.map((piece, index) => {
      return Object.assign(clone(piece), {
        index: this.placedPiecesCount + this.pieces.length + index,
        x: Math.floor((this.board.blocks[0].length - piece.blocks[0].length) / 2),
      });
    });
    this.pieces = [...this.pieces, ...indexedPieces];
  }

  get activePiece() {
    return this.pieces[0];
  }

  getNextPieces(count) {
    return this.pieces.slice(1, 1 + count);
  }

  updateActivePiece() {
    if (this.pieces.shift()) {
      this.placedPiecesCount++;
    }
  }

  putPiece(piece) {
    this.board.putPiece(piece);
    const numberOfFilledRows = this.board.countFilledRows();

    this.score += Game.getScore(numberOfFilledRows);
    this.board.clearBoard();
    this.updateActivePiece();

    return numberOfFilledRows;
  }

  reset() {
    this.status = WAITING;
    this.score = 0;
    this.pieces = [];
    this.placedPiecesCount = 0;
    this.board.reset();
  }
}

export { Player };

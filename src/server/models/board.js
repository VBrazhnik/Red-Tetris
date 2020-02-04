import { GameError } from '../errors/game-error';
import { EMPTY, FILLED, BLOCKED } from '../constants/cell-types';
import { cloneDeep as clone, isUndefined } from 'lodash';

class Board {
  constructor(rows, columns) {
    this.blocks = Array.from(Array(rows), () => new Array(columns).fill(EMPTY));
  }

  getSpectrum() {
    const spectrum = Board.transpose(this.blocks);

    spectrum.forEach(column => {
      column.reduce((previous, current, currentIndex) => {
        const value = previous !== EMPTY || current !== EMPTY ? FILLED : EMPTY;
        return (column[currentIndex] = value);
      }, EMPTY);
    });

    return Board.transpose(spectrum);
  }

  canPutPiece(piece) {
    for (let y = 0; y < piece.blocks.length; y++) {
      for (let x = 0; x < piece.blocks[0].length; x++) {
        if (piece.blocks[y][x] === FILLED) {
          if (
            isUndefined(this.blocks[piece.y + y]) ||
            isUndefined(this.blocks[piece.y + y][piece.x + x]) ||
            this.blocks[piece.y + y][piece.x + x] !== EMPTY
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  putPiece(piece) {
    if (!this.canPutPiece(piece)) {
      throw new GameError('Cannot place the piece on the board');
    }

    for (let y = 0; y < piece.blocks.length; y++) {
      for (let x = 0; x < piece.blocks[0].length; x++) {
        if (piece.blocks[y][x] === FILLED) {
          this.blocks[piece.y + y][piece.x + x] = piece.blocks[y][x];
        }
      }
    }
  }

  countFilledRows() {
    return this.blocks.filter(row => row.every(cell => cell === FILLED)).length;
  }

  clearBoard() {
    const clearedBoard = [];

    this.blocks.forEach(row => {
      if (row.every(cell => cell === FILLED)) {
        clearedBoard.unshift(Array(row.length).fill(EMPTY));
      } else {
        clearedBoard.push(clone(row));
      }
    });

    this.blocks = clearedBoard;
  }

  canAddBlockedRows(numberOfBlockedRows) {
    for (let index = 0; index < numberOfBlockedRows; index++) {
      if (!this.blocks[index].every(cell => cell === EMPTY)) {
        return false;
      }
    }
    return true;
  }

  addBlockedRows(numberOfBlockedRows) {
    this.blocks = [
      ...this.blocks.splice(numberOfBlockedRows).map(row => clone(row)),
      ...this.blocks.splice(0, numberOfBlockedRows).map(row => row.map(() => BLOCKED)),
    ];
  }

  reset() {
    this.blocks = this.blocks.map(row => row.map(() => EMPTY));
  }

  static transpose(blocks) {
    return Object.keys(blocks[0]).map(column => blocks.map(row => clone(row[column])));
  }
}

export { Board };

import { pieces } from '../constants/pieces';
import { FALLING } from '../constants/piece-statuses';
import { EMPTY } from '../constants/cell-types';
import { random } from 'lodash';

class Piece {
  constructor() {
    this.blocks = pieces[random(pieces.length - 1)];
    this.y = -this.blocks.findIndex(row => row.some(cell => cell !== EMPTY)) || 0;
    this.x = 0;
    this.status = FALLING;
  }

  static generatePieces(number) {
    const pieces = [];
    for (let i = 0; i < number; i++) {
      pieces.push(new Piece());
    }
    return pieces;
  }
}

export { Piece };

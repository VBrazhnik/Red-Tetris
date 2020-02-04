import { EMPTY } from '../../server/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

const movePieceUp = (piece, step) => {
  return Object.assign(clone(piece), {
    y:
      Math.max(piece.y - step, -piece.blocks.findIndex(row => row.some(cell => cell !== EMPTY))) ||
      0,
  });
};

export { movePieceUp };

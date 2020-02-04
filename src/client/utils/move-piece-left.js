import { cloneDeep as clone } from 'lodash';

const movePieceLeft = piece => {
  return Object.assign(clone(piece), {
    x: piece.x - 1,
  });
};

export { movePieceLeft };

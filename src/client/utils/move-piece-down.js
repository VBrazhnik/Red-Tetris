import { cloneDeep as clone } from 'lodash';

const movePieceDown = piece => {
  return Object.assign(clone(piece), {
    y: piece.y + 1,
  });
};

export { movePieceDown };

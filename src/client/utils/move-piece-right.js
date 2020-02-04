import { cloneDeep as clone } from 'lodash';

const movePieceRight = piece => {
  return Object.assign(clone(piece), {
    x: piece.x + 1,
  });
};

export { movePieceRight };

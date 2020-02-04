import { rotate } from '2d-array-rotation';
import { cloneDeep as clone } from 'lodash';

const rotatePiece = piece => {
  return Object.assign(clone(piece), {
    blocks: rotate(piece.blocks, 90),
  });
};

export { rotatePiece };

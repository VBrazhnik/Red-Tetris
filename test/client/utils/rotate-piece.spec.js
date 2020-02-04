import { describe, it } from 'mocha';
import { expect } from 'chai';

import { rotatePiece } from '../../../src/client/utils/rotate-piece';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('rotatePiece', function() {
  it('Should rotate blocks', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    expect(rotatePiece(piece)).to.be.deep.equal(
      Object.assign(clone(piece), {
        blocks: [
          [O, X, O],
          [O, X, X],
          [O, X, O],
        ],
      })
    );
  });
});

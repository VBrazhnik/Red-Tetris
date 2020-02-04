import { describe, it } from 'mocha';
import { expect } from 'chai';

import { movePieceRight } from '../../../src/client/utils/move-piece-right';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('movePieceRight', function() {
  it('Should increment the value of "x" property', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    expect(movePieceRight(piece)).to.be.deep.equal(Object.assign(clone(piece), { x: 2 }));
  });
});

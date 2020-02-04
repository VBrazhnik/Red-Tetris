import { describe, it } from 'mocha';
import { expect } from 'chai';

import { movePieceLeft } from '../../../src/client/utils/move-piece-left';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('movePieceLeft', function() {
  it('Should decrement the value of "x" property', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    expect(movePieceLeft(piece)).to.be.deep.equal(Object.assign(clone(piece), { x: 0 }));
  });
});

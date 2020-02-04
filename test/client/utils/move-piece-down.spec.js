import { describe, it } from 'mocha';
import { expect } from 'chai';

import { movePieceDown } from '../../../src/client/utils/move-piece-down';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('movePieceDown', function() {
  it('Should increment the value of "y" property', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, X, O],
        [X, X, X],
        [O, O, O],
      ],
    };

    expect(movePieceDown(piece)).to.be.deep.equal(Object.assign(clone(piece), { y: 2 }));
  });
});

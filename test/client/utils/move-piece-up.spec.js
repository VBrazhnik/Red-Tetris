import { describe, it } from 'mocha';
import { expect } from 'chai';

import { movePieceUp } from '../../../src/client/utils/move-piece-up';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

describe('movePieceUp', function() {
  it('Should change the value of "y" property', function() {
    const piece = {
      x: 1,
      y: 1,
      blocks: [
        [O, O, O, O],
        [X, X, X, X],
        [O, O, O, O],
        [O, O, O, O],
      ],
    };

    expect(movePieceUp(piece, 3)).to.be.deep.equal(Object.assign(clone(piece), { y: -1 }));
  });
});

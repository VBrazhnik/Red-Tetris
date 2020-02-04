import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { Board } from '../../../src/client/components/board';
import { EMPTY as O, FILLED as X, BLOCKED as B } from '../../../src/client/constants/cell-types';

describe('Board', function() {
  it('Should render a board', function() {
    const blocks = [
      [O, O, O, O],
      [O, O, O, O],
      [O, X, X, O],
      [O, X, X, X],
      [B, B, B, B],
    ];

    const wrapper = mount(<Board blocks={blocks} />);

    expect(wrapper)
      .to.have.className('board')
      .and.have.exactly(20)
      .descendants('.cell')
      .and.have.exactly(11)
      .descendants('.empty')
      .and.have.exactly(5)
      .descendants('.filled')
      .and.have.exactly(4)
      .descendants('.blocked');
  });
});

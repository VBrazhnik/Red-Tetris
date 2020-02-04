import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { NextPiecesSidebar } from '../../../src/client/components/next-pieces-sidebar';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Next Pieces Sidebar', function() {
  it('Should render a next pieces sidebar', function() {
    const pieces = [
      [
        [O, O, O, O],
        [O, X, X, O],
        [O, O, X, X],
        [O, O, O, O],
      ],
      [
        [O, O, O, O],
        [X, X, X, X],
        [O, O, O, O],
        [O, O, O, O],
      ],
    ];

    const wrapper = mount(<NextPiecesSidebar pieces={pieces} />);

    expect(wrapper)
      .to.have.tagName('aside')
      .and.have.id('next-pieces-sidebar')
      .and.have.exactly(pieces.length)
      .descendants('.next-piece');
  });
});

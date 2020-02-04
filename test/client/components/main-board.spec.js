import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { MainBoard } from '../../../src/client/components/main-board';
import { PLAYING } from '../../../src/client/constants/player-statuses';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Main Board', function() {
  it('Should render a main board', function() {
    const blocks = [
      [O, O, O, O],
      [O, O, O, O],
      [O, O, X, O],
      [O, O, X, X],
      [X, O, X, X],
    ];

    const wrapper = mount(<MainBoard playerStatus={PLAYING} blocks={blocks} />);

    expect(wrapper)
      .to.have.tagName('section')
      .and.have.id('main-board')
      .and.have.exactly(1)
      .descendants('.board');
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { Cell } from '../../../src/client/components/cell';
import { EMPTY, FILLED, BLOCKED } from '../../../src/client/constants/cell-types';

describe('Cell', function() {
  it('Should render an empty cell', function() {
    const wrapper = mount(<Cell type={EMPTY} />);

    expect(wrapper)
      .to.have.className('cell')
      .and.have.className('empty');
  });

  it('Should render a filled cell', function() {
    const wrapper = mount(<Cell type={FILLED} />);

    expect(wrapper)
      .to.have.className('cell')
      .and.have.className('filled');
  });

  it('Should render a blocked cell', function() {
    const wrapper = mount(<Cell type={BLOCKED} />);

    expect(wrapper)
      .to.have.className('cell')
      .and.have.className('blocked');
  });
});

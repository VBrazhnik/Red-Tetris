import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { StatusLine } from '../../../src/client/components/status-line';

describe('Status Line', function() {
  it('Should render a status line', function() {
    const status = 'Game was finished';

    const wrapper = mount(<StatusLine status={status} />);

    expect(wrapper)
      .to.have.tagName('footer')
      .and.have.id('status-line')
      .and.have.exactly(1)
      .descendants('p');
  });
});

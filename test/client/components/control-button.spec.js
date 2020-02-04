import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { ControlButton } from '../../../src/client/components/control-button';

describe('Control Button', function() {
  it('Should render a control button', function() {
    const title = 'Start game';
    const handler = () => {};

    const wrapper = mount(<ControlButton title={title} handler={handler} />);

    expect(wrapper)
      .to.have.className('control-button')
      .and.have.descendants('p');
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { LoadingScreen } from '../../../src/client/components/loading-screen';

describe('Loading Screen', function() {
  it('Should render a loading screen', function() {
    const wrapper = mount(<LoadingScreen />);

    expect(wrapper)
      .to.have.id('logo')
      .and.have.descendants('p');
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { StatisticsSidebar } from '../../../src/client/components/statistics-sidebar';

describe('Statistics Sidebar', function() {
  it('Should render a statistics sidebar', function() {
    const statistics = [
      {
        value: 10,
        caption: 'position',
      },
      {
        value: 2100,
        caption: 'points',
      },
    ];

    const wrapper = mount(<StatisticsSidebar statistics={statistics} />);

    expect(wrapper)
      .to.have.tagName('aside')
      .and.have.id('statistics-sidebar')
      .and.have.exactly(statistics.length)
      .descendants('.statistic-block');
  });
});

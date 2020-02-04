import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { SpectrumsRibbon } from '../../../src/client/components/spectrums-ribbon';
import { PLAYING, FINISHED } from '../../../src/client/constants/player-statuses';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Spectrums Ribbon', function() {
  it('Should render a spectrums ribbon', function() {
    const player = {
      id: 'id-1',
    };

    const participants = [
      {
        id: 'id-1',
        name: 'player-1',
        status: PLAYING,
        score: 100,
        boardSpectrum: [
          [O, O, O, O],
          [O, O, O, O],
          [O, X, O, O],
          [O, X, X, X],
          [O, X, X, X],
        ],
      },
      {
        id: 'id-2',
        name: 'player-2',
        status: FINISHED,
        score: 40,
        boardSpectrum: [
          [O, O, O, O],
          [O, O, O, O],
          [O, X, O, O],
          [O, X, O, X],
          [O, X, O, X],
        ],
      },
    ];

    const wrapper = mount(<SpectrumsRibbon player={player} participants={participants} />);

    expect(wrapper)
      .to.have.tagName('header')
      .and.have.id('spectrums-ribbon-container')
      .and.have.exactly(participants.length)
      .descendants('.spectrum');

    expect(wrapper.find('.player').first()).to.have.className('active');
    expect(wrapper.find('.opponent').first()).to.not.have.className('active');
  });
});

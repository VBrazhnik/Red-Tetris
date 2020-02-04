import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import { GameScreen } from '../../../src/client/components/game-screen';
import { SpectrumsRibbon } from '../../../src/client/components/spectrums-ribbon';
import { StatisticsSidebar } from '../../../src/client/components/statistics-sidebar';
import { MainBoard } from '../../../src/client/components/main-board';
import { NextPiecesSidebar } from '../../../src/client/components/next-pieces-sidebar';
import { StatusLine } from '../../../src/client/components/status-line';
import { PLAYING } from '../../../src/client/constants/player-statuses';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Game Screen', function() {
  it('Should render a game screen', function() {
    const player = {
      id: 'id-1',
      status: PLAYING,
    };
    const board = [
      [O, O, O, O],
      [O, O, O, O],
      [O, O, X, O],
      [O, O, X, X],
      [X, O, X, X],
    ];
    const participants = [
      {
        id: 'id-1',
        name: '',
        status: PLAYING,
        score: 100,
        boardSpectrum: [
          [O, O, O, O],
          [O, O, O, O],
          [O, O, X, O],
          [O, O, X, X],
          [X, O, X, X],
        ],
      },
    ];
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
    const nextPieces = [
      [
        [O, O, O, O],
        [O, X, X, O],
        [O, O, X, X],
        [O, O, O, O],
      ],
    ];
    const statusString = 'Game was finished';

    const wrapper = mount(
      <GameScreen
        player={player}
        board={board}
        participants={participants}
        statistics={statistics}
        nextPieces={nextPieces}
        statusString={statusString}
      />
    );

    expect(wrapper)
      .to.have.exactly(1)
      .descendants('main')
      .to.have.exactly(1)
      .descendants(SpectrumsRibbon)
      .to.have.exactly(1)
      .descendants(StatusLine);

    expect(wrapper.find('main'))
      .to.have.exactly(1)
      .descendants(StatisticsSidebar)
      .to.have.exactly(1)
      .descendants(MainBoard)
      .to.have.exactly(1)
      .descendants(NextPiecesSidebar);
  });
});

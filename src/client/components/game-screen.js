import React from 'react';
import { SpectrumsRibbon } from './spectrums-ribbon';
import { MainBoard } from './main-board';
import { StatisticsSidebar } from './statistics-sidebar';
import { NextPiecesSidebar } from './next-pieces-sidebar';
import { StatusLine } from './status-line';
import { WAITING } from '../constants/player-statuses';

const GameScreen = ({ player, board, participants, statistics, nextPieces, statusString }) => {
  return (
    <>
      <SpectrumsRibbon player={player} participants={participants} />
      <main>
        {player.status !== WAITING && <StatisticsSidebar statistics={statistics} />}
        <MainBoard playerStatus={player.status} blocks={board} />
        {player.status !== WAITING && <NextPiecesSidebar pieces={nextPieces} />}
      </main>
      <StatusLine status={statusString} />
    </>
  );
};

export { GameScreen };

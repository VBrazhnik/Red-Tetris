import React from 'react';
import classNames from 'classnames';
import { Board } from './board';
import { PLAYING } from '../constants/player-statuses';

const MainBoard = ({ playerStatus, blocks }) => {
  const className = classNames({ 'active': playerStatus === PLAYING });
  return (
    <section id="main-board" className={className}>
      <Board blocks={blocks} />
    </section>
  );
};

export { MainBoard };

import React from 'react';
import classNames from 'classnames';
import { Board } from './board';
import { PLAYING } from '../constants/player-statuses';

const SpectrumsRibbon = ({ player, participants }) => {
  return (
    <header id="spectrums-ribbon-container">
      <div className="spectrums-ribbon">
        {participants.map(({ id, name, status, score, boardSpectrum }) => {
          const className = classNames(
            'spectrum',
            { 'player': id === player.id },
            { 'opponent': id !== player.id },
            { 'active': status === PLAYING }
          );
          return (
            <div className={className} key={id}>
              <Board blocks={boardSpectrum} />
              <div className="score">
                {score}
                <span className="tooltip-text">{name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
};

export { SpectrumsRibbon };

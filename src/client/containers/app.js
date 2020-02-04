import React from 'react';
import '../assets/styles/reset.css';
import '../assets/styles/index.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GameScreen } from '../components/game-screen';
import { LoadingScreen } from '../components/loading-screen';
import { ControlButton } from '../components/control-button';
import { NotificationContainer } from 'react-notifications';
import {
  getPlayer,
  getBoard,
  getParticipants,
  getStatusString,
  getNextPieces,
  getStatistics,
} from '../selectors';
import { startGame, resetGame } from '../actions';
import { COMPLETED, PENDING } from '../constants/game-statuses';
import { isUndefined } from 'lodash';

const App = ({
  gameStatus,
  player,
  board,
  participants,
  statistics,
  nextPieces,
  statusString,
  buttonHandlers,
}) => {
  if (!isUndefined(player)) {
    let controlButton;
    if (player.isAdmin && buttonHandlers[gameStatus]) {
      controlButton = buttonHandlers[gameStatus];
    }

    return (
      <>
        <GameScreen
          player={player}
          board={board}
          participants={participants}
          statistics={statistics}
          nextPieces={nextPieces}
          statusString={statusString}
        />
        {controlButton && (
          <ControlButton title={controlButton.title} handler={controlButton.handler} />
        )}
        <NotificationContainer />
      </>
    );
  } else {
    return (
      <>
        <LoadingScreen />
        <NotificationContainer />
      </>
    );
  }
};

const mapStateToProps = state => {
  if (!isUndefined(state.status)) {
    const props = {
      gameStatus: state.gameStatus,
      player: getPlayer(state),
      board: getBoard(state),
      participants: getParticipants(state),
      statusString: getStatusString(state),
    };

    if (state.gameStatus !== PENDING) {
      Object.assign(props, {
        statistics: getStatistics(state),
        nextPieces: getNextPieces(state),
      });
    }

    return props;
  }
};

const mapDispatchToProps = dispatch => {
  return {
    buttonHandlers: {
      [PENDING]: {
        title: 'Start Game',
        handler: bindActionCreators(startGame, dispatch),
      },
      [COMPLETED]: {
        title: 'End Game',
        handler: bindActionCreators(resetGame, dispatch),
      },
    },
  };
};

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export { connectedApp as App };

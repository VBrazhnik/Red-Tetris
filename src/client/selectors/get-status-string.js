import converter from 'number-to-words';
import { PENDING, RUNNING, COMPLETED } from '../constants/game-statuses';
import { PLAYING } from '../constants/player-statuses';

const getStatusString = ({ gameStatus, id: playerId, playersList }) => {
  switch (gameStatus) {
    case PENDING: {
      if (playersList.length === 1) {
        return 'Only you joined the room';
      } else {
        return `${playersList.length} players joined the room`;
      }
    }

    case RUNNING: {
      const player = playersList.find(({ id }) => id === playerId);

      if (player.status === PLAYING) {
        return 'You are playing the game';
      } else {
        const playingOpponents = playersList.filter(({ status }) => status === PLAYING);

        if (playingOpponents.length === 1) {
          return 'One opponent is still playing the game';
        } else {
          return `${playingOpponents.length} opponents are still playing the game`;
        }
      }
    }

    case COMPLETED: {
      const player = playersList.find(({ id }) => id === playerId);

      if (player.position === 0) {
        return 'You won the game';
      } else {
        return `You took the ${converter.toOrdinal(player.position + 1)} position`;
      }
    }
  }
};

export { getStatusString };

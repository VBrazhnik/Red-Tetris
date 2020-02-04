import converter from 'number-to-words';

const getStatistics = ({ activePiece, id: playerId, playersList }) => {
  const statisticBlocks = [];

  const player = playersList.find(({ id }) => id === playerId);

  statisticBlocks.push({
    value: converter.toOrdinal(player.position + 1),
    caption: 'position',
  });

  statisticBlocks.push({
    value: player.score,
    caption: 'points',
  });

  statisticBlocks.push({
    value: activePiece.index,
    caption: 'pieces',
  });

  return statisticBlocks;
};

export { getStatistics };

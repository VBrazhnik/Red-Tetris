import { renderPieceOnBoard } from '../utils/render-piece-on-board';
import { EMPTY } from '../../server/constants/cell-types';
import { cloneDeep as clone } from 'lodash';

const SIDE_LENGTH = 4;

const createEmptyBlocks = (rows, columns) => {
  return Array.from(Array(rows), () => new Array(columns).fill(EMPTY));
};

const getNormalizedPieceBlocks = blocks => {
  const normalizedBlocks = createEmptyBlocks(SIDE_LENGTH, SIDE_LENGTH);

  const clearedBlocks = blocks.filter(row => row.some(cell => cell !== EMPTY));
  const piece = Object.assign(
    {
      blocks: clone(clearedBlocks),
    },
    {
      y: Math.floor((normalizedBlocks.length - clearedBlocks.length) / 2),
      x: Math.ceil((normalizedBlocks[0].length - clearedBlocks[0].length) / 2),
    }
  );

  return renderPieceOnBoard(piece, normalizedBlocks);
};

const getNextPieces = ({ nextPieces }) => {
  return nextPieces.map(({ blocks }) => getNormalizedPieceBlocks(blocks));
};

export { getNextPieces };

import { EMPTY as O, FILLED as X } from './cell-types';

const pieceI = [
  [O, O, O, O],
  [X, X, X, X],
  [O, O, O, O],
  [O, O, O, O],
];

const pieceJ = [
  [X, O, O],
  [X, X, X],
  [O, O, O],
];

const pieceL = [
  [O, O, X],
  [X, X, X],
  [O, O, O],
];

const pieceO = [
  [X, X],
  [X, X],
];

const pieceS = [
  [O, X, X],
  [X, X, O],
  [O, O, O],
];

const pieceT = [
  [O, X, O],
  [X, X, X],
  [O, O, O],
];

const pieceZ = [
  [X, X, O],
  [O, X, X],
  [O, O, O],
];

const pieces = [pieceI, pieceJ, pieceL, pieceO, pieceS, pieceT, pieceZ];

export { pieces };

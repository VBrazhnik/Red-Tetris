import * as actionType from '../constants/action-types';
import * as pieceMovementsType from '../constants/piece-movements-types';
import { PLAYING } from '../constants/player-statuses';
import { FALLING } from '../constants/piece-statuses';

const bouncerMiddleWare = ({ getState }) => {
  return next => action => {
    const state = getState();
    if (action.type !== actionType.UPDATE_STATE && state.status !== PLAYING) {
      return;
    }

    if (
      Object.values(pieceMovementsType).includes(action.type) &&
      (!state.activePiece || state.activePiece.status !== FALLING)
    ) {
      return;
    }

    return next(action);
  };
};

export { bouncerMiddleWare };

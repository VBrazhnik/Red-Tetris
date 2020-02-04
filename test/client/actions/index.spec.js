import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  updateState,
  addBlockedRows,
  rotatePiece,
  movePieceRight,
  movePieceDown,
  movePieceLeft,
  dropPieceDown,
  joinRoom,
  startGame,
  putPiece,
  finishGame,
  resetGame,
} from '../../../src/client/actions';

describe('Actions', function() {
  it('#updateState()', function() {
    expect(updateState()).to.have.all.keys('type', 'state');
  });

  it('#addBlockedRows()', function() {
    expect(addBlockedRows()).to.have.all.keys('type', 'numberOfBlockedRows', 'state');
  });

  it('#rotatePiece()', function() {
    expect(rotatePiece()).to.have.all.keys('type');
  });

  it('#movePieceRight()', function() {
    expect(movePieceRight()).to.have.all.keys('type');
  });

  it('#movePieceDown()', function() {
    expect(movePieceDown()).to.have.all.keys('type');
  });

  it('#movePieceLeft()', function() {
    expect(movePieceLeft()).to.have.all.keys('type');
  });

  it('#dropPieceDown()', function() {
    expect(dropPieceDown()).to.have.all.keys('type');
  });

  it('#joinRoom()', function() {
    expect(joinRoom()).to.have.all.keys('type', 'outgoing', 'roomName', 'playerName');
  });

  it('#startGame()', function() {
    expect(startGame()).to.have.all.keys('type', 'outgoing');
  });

  it('#putPiece()', function() {
    expect(putPiece()).to.have.all.keys('type', 'outgoing', 'piece');
  });

  it('#finishGame()', function() {
    expect(finishGame()).to.have.all.keys('type', 'outgoing');
  });

  it('#resetGame()', function() {
    expect(resetGame()).to.have.all.keys('type', 'outgoing');
  });
});

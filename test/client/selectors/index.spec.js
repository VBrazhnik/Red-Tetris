import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  getPlayer,
  getBoard,
  getParticipants,
  getStatusString,
  getNextPieces,
  getStatistics,
} from '../../../src/client/selectors';
import { PENDING, RUNNING, COMPLETED } from '../../../src/client/constants/game-statuses';
import { WAITING, PLAYING, FINISHED } from '../../../src/client/constants/player-statuses';
import { EMPTY as O, FILLED as X } from '../../../src/client/constants/cell-types';

describe('Selectors', function() {
  function getState(state) {
    const board = [
      [O, O, O, O],
      [O, O, O, O],
      [O, X, O, O],
      [O, X, X, X],
      [O, X, X, X],
    ];

    const renderedBoard = [
      [O, O, X, O],
      [O, X, X, O],
      [O, X, X, O],
      [O, X, X, X],
      [O, X, X, X],
    ];

    return Object.assign(
      {
        id: 'id-1',
        name: 'player-1',
        isAdmin: true,
        status: PLAYING,
        score: 0,
        gameStatus: RUNNING,
        board: board,
        renderedBoard: renderedBoard,
        playersList: [],
      },
      state
    );
  }

  it('#getPlayer()', function() {
    const state = getState();

    const player = getPlayer(state);

    expect(player)
      .to.have.property('id')
      .which.is.equal('id-1');
    expect(player).to.have.property('isAdmin').which.is.true;
    expect(player)
      .to.have.property('status')
      .which.is.equal(PLAYING);
  });

  it('#getBoard()', function() {
    const state = getState();

    expect(getBoard(state)).to.be.deep.equal([
      [O, O, X, O],
      [O, X, X, O],
      [O, X, X, O],
      [O, X, X, X],
      [O, X, X, X],
    ]);
  });

  it('#getParticipants()', function() {
    const state = getState();

    expect(getParticipants(state)).to.be.deep.equal([]);
  });

  describe('#getStatusString()', function() {
    it('Should return a status string when only one player joined the room', function() {
      const state = getState({
        gameStatus: PENDING,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: WAITING,
            score: 0,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('Only you joined the room');
    });

    it('Should return a status string when multiple players joined the room', function() {
      const state = getState({
        gameStatus: PENDING,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: WAITING,
            score: 0,
            position: 0,
          },
          {
            id: 'id-2',
            name: 'player-2',
            status: WAITING,
            score: 0,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('2 players joined the room');
    });

    it('Should return a status string when the player is playing', function() {
      const state = getState({
        gameStatus: RUNNING,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: PLAYING,
            score: 0,
            position: 0,
          },
          {
            id: 'id-2',
            name: 'player-2',
            status: PLAYING,
            score: 0,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('You are playing the game');
    });

    it('Should return a status string when the opponent is playing', function() {
      const state = getState({
        gameStatus: RUNNING,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: FINISHED,
            score: 0,
            position: 0,
          },
          {
            id: 'id-2',
            name: 'player-2',
            status: PLAYING,
            score: 0,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('One opponent is still playing the game');
    });

    it('Should return a status string when multiple opponents are playing', function() {
      const state = getState({
        gameStatus: RUNNING,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: FINISHED,
            score: 0,
            position: 0,
          },
          {
            id: 'id-2',
            name: 'player-2',
            status: PLAYING,
            score: 0,
            position: 0,
          },
          {
            id: 'id-3',
            name: 'player-3',
            status: PLAYING,
            score: 0,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('2 opponents are still playing the game');
    });

    it('Should return a status string when the player is a winner', function() {
      const state = getState({
        gameStatus: COMPLETED,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: FINISHED,
            score: 100,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('You won the game');
    });

    it('Should return a status string when the player lost the game', function() {
      const state = getState({
        gameStatus: COMPLETED,
        playersList: [
          {
            id: 'id-1',
            name: 'player-1',
            status: FINISHED,
            score: 100,
            position: 1,
          },
          {
            id: 'id-2',
            name: 'player-2',
            status: FINISHED,
            score: 200,
            position: 0,
          },
        ],
      });

      expect(getStatusString(state)).to.be.equal('You took the 2nd position');
    });
  });

  it('#getStatistics()', function() {
    const state = getState({
      gameStatus: COMPLETED,
      status: FINISHED,
      score: 100,
      activePiece: {
        index: 7,
      },
      playersList: [
        {
          id: 'id-1',
          name: 'player-1',
          status: FINISHED,
          score: 100,
          position: 0,
        },
      ],
    });
    expect(getStatistics(state)).to.be.deep.equal([
      {
        value: '1st',
        caption: 'position',
      },
      {
        value: 100,
        caption: 'points',
      },
      {
        value: 7,
        caption: 'pieces',
      },
    ]);
  });

  it('#getNextPieces()', function() {
    const state = getState({
      nextPieces: [
        {
          x: 0,
          y: 0,
          blocks: [
            [X, X, O],
            [O, X, X],
            [O, O, O],
          ],
        },
      ],
    });

    expect(getNextPieces(state)).to.be.deep.equal([
      [
        [O, O, O, O],
        [O, X, X, O],
        [O, O, X, X],
        [O, O, O, O],
      ],
    ]);
  });
});

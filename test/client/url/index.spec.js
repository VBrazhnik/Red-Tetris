import { describe, it } from 'mocha';
import { expect } from 'chai';

import { parseUrl } from '../../../src/client/url';

describe('URL', function() {
  it('Should return a room name and a player name from plain URL', function() {
    expect(parseUrl('http://127.0.0.1:3000/#room-1[player-1]')).to.be.deep.equal({
      roomName: 'room-1',
      playerName: 'player-1',
    });
  });

  it('Should return a room name and a player name from encoded URL', function() {
    expect(parseUrl('http://127.0.0.1:3000/#room-1%5Bplayer-1%5D')).to.be.deep.equal({
      roomName: 'room-1',
      playerName: 'player-1',
    });
  });

  it('Should return an empty object if a room name or a player name cannot be parsed', function() {
    expect(parseUrl('http://127.0.0.1:3000/')).to.be.an('object').which.is.empty;
  });
});

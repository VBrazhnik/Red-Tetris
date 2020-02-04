import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Piece } from '../../../src/server/models/piece';
import { FALLING } from '../../../src/server/constants/piece-statuses';

describe('Piece', function() {
  describe('#constructor()', function() {
    it('Should return an object with all required properties', function() {
      const piece = new Piece();

      expect(piece).to.have.all.keys('status', 'x', 'y', 'blocks');

      expect(piece.status)
        .to.be.a('string')
        .which.is.equal(FALLING);
      expect(piece.x)
        .to.be.a('number')
        .which.satisfies(Number.isInteger);
      expect(piece.y)
        .to.be.a('number')
        .which.satisfies(Number.isInteger);
      expect(piece.blocks).to.be.an('array');
    });
  });

  describe('#generatePieces()', function() {
    it('Should return an array with specified number of pieces', function() {
      const pieces = Piece.generatePieces(10);

      expect(pieces)
        .to.be.an('array')
        .which.has.lengthOf(10);
    });
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';

import { config } from '../../../src/server/config';

describe('Configuration', function() {
  it('Should return configuration', function() {
    expect(config).to.have.all.keys(
      'host',
      'port',
      'url',
      'board',
      'piecesGeneratingBatch',
      'nextPiecesCount'
    );

    expect(config.host).to.be.a('string');
    expect(config.port)
      .to.be.a('number')
      .which.is.above(0)
      .and.satisfies(Number.isInteger);
    expect(config.url).to.be.a('string');
    expect(config.board)
      .to.have.property('rows')
      .which.is.a('number')
      .above(0)
      .and.satisfies(Number.isInteger);
    expect(config.board)
      .to.have.property('columns')
      .which.is.a('number')
      .above(0)
      .and.satisfies(Number.isInteger);
    expect(config.piecesGeneratingBatch)
      .to.be.a('number')
      .which.is.above(0)
      .and.satisfies(Number.isInteger);
    expect(config.nextPiecesCount)
      .to.be.a('number')
      .which.is.above(0)
      .and.satisfies(Number.isInteger);
  });
});

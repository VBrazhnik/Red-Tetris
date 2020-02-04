import { describe, it, before, after } from 'mocha';
import chai, { expect } from 'chai';
import mock from 'mock-fs';

import { app } from '../../../src/server/app';
import * as HttpStatus from 'http-status-codes';

describe('HTTP Endpoints', function() {
  let request;

  before(function() {
    request = chai.request(app.listen()).keepOpen();
  });

  after(function() {
    request.close();
  });

  it('Should return HTML file on request to "/"', function(done) {
    request
      .get('/')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.OK);
        expect(response).to.have.header('Content-Type', 'text/html');
      })
      .then(done, done);
  });

  it('Should return HTML file on request to "/index.html"', function(done) {
    request
      .get('/index.html')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.OK);
        expect(response).to.have.header('Content-Type', 'text/html');
      })
      .then(done, done);
  });

  it('Should return JS file on request to "/bundle.js"', function(done) {
    request
      .get('/bundle.js')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.OK);
        expect(response).to.have.header('Content-Type', 'application/javascript');
      })
      .then(done, done);
  });

  it('Should return CSS file on request to "/main.css"', function(done) {
    request
      .get('/main.css')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.OK);
        expect(response).to.have.header('Content-Type', 'text/css');
      })
      .then(done, done);
  });

  it('Should return font file on request to "/fonts/akrobat-bold.ttf"', function(done) {
    request
      .get('/fonts/akrobat-bold.ttf')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.OK);
        expect(response).to.have.header('Content-Type', 'font/ttf');
      })
      .then(done, done);
  });

  it('Should return an error in case of invalid request', function(done) {
    request
      .get('/invalid')
      .send()
      .then(response => {
        expect(response).to.have.status(HttpStatus.NOT_FOUND);
      })
      .then(done, done);
  });

  describe('Internal Server Errors', function() {
    before(function() {
      mock({});
    });

    after(function() {
      mock.restore();
    });

    it('Should return an error in case of file access error', function(done) {
      request
        .get('/index.html')
        .send()
        .then(response => {
          expect(response).to.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
        })
        .then(done, done);
    });
  });
});

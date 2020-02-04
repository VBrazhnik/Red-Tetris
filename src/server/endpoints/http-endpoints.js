import fs from 'fs';
import path from 'path';
import * as HttpStatus from 'http-status-codes';
import mime from 'mime-types';
import { isUndefined } from 'lodash';
import { logger } from '../logger';

const resources = {
  '/': '../../../build/index.html',
  '/index.html': '../../../build/index.html',
  '/favicon.ico': '../../../build/favicon.ico',
  '/bundle.js': '../../../build/bundle.js',
  '/main.css': '../../../build/main.css',
  '/fonts/akrobat-bold.ttf': '../../../build/fonts/akrobat-bold.ttf',
};

function httpRequestHandler(request, response) {
  const file = resources[request.url];

  if (!isUndefined(file)) {
    fs.readFile(path.resolve(__dirname, file), (error, data) => {
      if (error) {
        logger.error(`Cannot load ${path.parse(file).base}`, { error });
        response.writeHead(HttpStatus.INTERNAL_SERVER_ERROR);
        return response.end(`Cannot load ${path.parse(file).base}`);
      }
      response.writeHead(HttpStatus.OK, { 'Content-Type': mime.lookup(file) });
      response.end(data);
    });
  } else {
    response.writeHead(HttpStatus.NOT_FOUND);
    response.end();
  }
}

export { httpRequestHandler };

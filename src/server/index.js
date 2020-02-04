import { config } from './config';
import { app } from './app';
import { logger } from './logger';

app.listen({ host: config.host, port: config.port }, () => {
  logger.info(`Tetris listens on ${config.url}`);
});

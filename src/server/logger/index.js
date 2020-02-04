import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === 'test') {
  logger.transports.forEach(transport => (transport.silent = true));
}

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: `./logs/${new Date().toISOString()}.log` }));
}

export { logger };

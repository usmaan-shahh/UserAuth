import { fileURLToPath } from 'url';
import winston from 'winston';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '..', 'logs');
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;


const errorFileTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'error.log'),
  level: 'error',
  maxsize: MAX_SIZE,
  maxFiles: MAX_FILES,
});

const combinedFileTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'combined.log'),
  maxsize: MAX_SIZE,
  maxFiles: MAX_FILES,
});

const exceptionFileHandler = new winston.transports.File({
  filename: path.join(LOG_DIR, 'exceptions.log'),
});

const rejectionFileHandler = new winston.transports.File({
  filename: path.join(LOG_DIR, 'rejections.log'),
});


const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({

  level: 'debug', 
  format: logFormat,

  transports: [
    errorFileTransport,
    combinedFileTransport,
  ],

  exceptionHandlers: [
    exceptionFileHandler,
  ],

  rejectionHandlers: [
    rejectionFileHandler,
  ],

});


export const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;

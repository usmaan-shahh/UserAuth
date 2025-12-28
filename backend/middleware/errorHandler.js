import logger from '../utils/logger.js';

const errorHandler = (error, req, res, __) => {

    // Log error with Winston
    logger.error('Request error', {
        errorName: error.name,
        errorMessage: error.message,
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        stack: error.stack
    });

    const status = error.statusCode || res.statusCode || 500 // server error 

    res.status(status)

    res.json({ message: error.message, isError: true })
}

export default errorHandler;




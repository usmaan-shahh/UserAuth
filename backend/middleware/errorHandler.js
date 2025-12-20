import { logEvents } from '../utils/logger.js';

const errorHandler = (error, req, res, __) => {

    logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')

    const status = error.statusCode || res.statusCode || 500 // server error 

    res.status(status)

    res.json({ message: error.message, isError: true })
}

export default errorHandler;




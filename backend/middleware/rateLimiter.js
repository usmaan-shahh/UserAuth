import rateLimit from 'express-rate-limit';
import { logEvents } from '../utils/logger.js';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 login requests per windowMs
    message: { message: 'Too many login attempts from this IP, please try again after 60 seconds' },
    headers: true,         // send RateLimit-* headers (alias to standardHeaders)
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false,  // Disable the X-RateLimit-* headers


    handler: (req, res, next, options) => {
        // Log the event with relevant details
        const logMsg = `Too Many Requests: ${options.message.message}\t${req.method}\t${req.originalUrl}\t${req.ip}\t${req.headers.origin || '-'}`;
        logEvents(logMsg, 'errLog.log');

        // Send the configured response
        res.status(options.statusCode).send(options.message);
    }


});

export default loginLimiter;

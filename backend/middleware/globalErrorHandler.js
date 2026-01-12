import logger from "../utils/logger.js";

const globalErrorHandler = (
  errorObject,
  requestObject,
  responseObject,
  next,
) => {
  logger.error(`Error in ${requestObject.method} ${requestObject.url}`, {
    errorName: errorObject.name,
    errorMessage: errorObject.message,
    method: requestObject.method,
    url: requestObject.url,
    origin: requestObject.headers.origin,
    ip:
      requestObject.headers["x-forwarded-for"]?.split(",")[0] ||
      requestObject.ip ||
      requestObject.socket?.remoteAddress,
    userAgent: requestObject.headers["user-agent"],
  });
  const status = errorObject.statusCode || responseObject.statusCode || 500;
  responseObject
    .status(status)
    .json({ message: errorObject.message, isError: true });
};

export default globalErrorHandler;

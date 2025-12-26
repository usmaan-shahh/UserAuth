import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,

    process.env.accessTokenSecret,

    (error, decoded) => {
      if (error) {
        logger.warn('JWT verification failed', {
          error: error.message,
          type: error.name,
          url: req.url
        });
        return res.status(403).json({ message: "Forbidden" });
      }

      req.auth = {
        user: decoded.username, 
        userId: decoded.userId, 
      };

      next();
    }
  );
};

export default verifyJWT;



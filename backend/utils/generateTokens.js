import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateTokens = ({ _id, username, roles  }) => {

  const payload = {
    userId: _id.toString(),
    roles,

  };

  // Generate opaque refresh token (random string)
  const refreshToken = crypto.randomBytes(64).toString("hex");

  return {
    accessToken: jwt.sign(payload, process.env.accessTokenSecret, {
      expiresIn: "15m",
    }),
    refreshToken,
    userId: _id.toString(),
  };
};

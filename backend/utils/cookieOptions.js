// Set token as an HTTP-only cookie
// secure: false allows cookies to be sent over HTTP (useful in development).
// secure: true enforces cookies to be sent only over HTTPS (for security in production).

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 1000,
};

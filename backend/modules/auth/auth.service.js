import bcrypt from "bcryptjs";
import { addDays } from "date-fns";
import jwt from "jsonwebtoken";
import { detectSuspiciousActivity } from "../../utils/deviceParser.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { DuplicateUserError, InvalidCredentialsError } from "./auth.errors.js";
import AuthUser from "./auth.model.js";
import { AuthRepository } from "./auth.repository.js";
import RefreshToken from "./refreshToken.model.js";

const MAX_DEVICES_PER_USER = 5;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const registerUser = async (
  { username, password },
  deviceInfo,
  ipAddress,
  location,
) => {
  const found = await AuthRepository.findByUsername(username);

  if (found) {
    throw new DuplicateUserError();
  }
  const hashedPwd = await bcrypt.hash(password, 10);

  const user = await AuthRepository.createUser({
    username,
    password: hashedPwd,
  });

  const tokens = generateTokens(user);

  const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);

  //“This session will die exactly 7 calendar days from now.”
  const expiresAt = addDays(new Date(), REFRESH_TOKEN_EXPIRY_DAYS);

  // First login is never suspicious
  await AuthRepository.storeRefreshToken(
    user._id,
    refreshTokenHash,
    deviceInfo,
    ipAddress,
    location,
    expiresAt,
    false,
    null,
  );

  return tokens;
};


export const loginUser = async (
  { username, password },
  deviceInfo,
  ipAddress,
  location,
) => {
  const foundUser = await AuthUser.findOne({ username })
    .select("+password")
    .exec();

  if (!foundUser) {
    throw new InvalidCredentialsError();
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) throw new InvalidCredentialsError();

  // Check for suspicious activity
  const previousSessions = await AuthRepository.getAllUserSessions(
    foundUser._id,
  );
  const { isSuspicious, reason } = detectSuspiciousActivity(
    deviceInfo,
    ipAddress,
    previousSessions,
  );

  // Check device limit and enforce if needed
  const activeSessionCount = await AuthRepository.countActiveSessions(
    foundUser._id,
  );

  if (activeSessionCount >= MAX_DEVICES_PER_USER) {
    // Revoke oldest session to make room
    const oldestSession = await AuthRepository.findOldestActiveSession(
      foundUser._id,
    );
    if (oldestSession) {
      await AuthRepository.revokeRefreshToken(oldestSession._id);
    }
  }

  const tokens = generateTokens(foundUser);
  const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);

  const expiresAt = addDays(new Date(), REFRESH_TOKEN_EXPIRY_DAYS);

  await AuthRepository.storeRefreshToken(
    foundUser._id,
    refreshTokenHash,
    deviceInfo,
    ipAddress,
    location,
    expiresAt,
    isSuspicious,
    reason,
  );

  return {
    tokens,
    isSuspicious,
    suspicionReason: reason,
  };
};

/**
 * Refresh access token using opaque refresh token
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("UNAUTHORIZED");
  }

  // Find the token in database by comparing hashes
  const storedToken =
    await AuthRepository.findValidRefreshTokenByHash(refreshToken);

  if (!storedToken) {
    throw new Error("FORBIDDEN");
  }

  // Get user from the stored token
  const user = await AuthUser.findById(storedToken.userId).exec();

  if (!user) {
    throw new Error("FORBIDDEN");
  }

  // Update last used timestamp
  await AuthRepository.updateRefreshTokenUsage(storedToken._id);

  // Generate NEW access token (keep same refresh token)
  const newAccessToken = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.accessTokenSecret,
    { expiresIn: "15m" },
  );

  return { accessToken: newAccessToken, refreshToken };
};

/**
 * Logout user from current device
 */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  try {
    // Find and revoke the specific token by comparing hashes
    const storedToken =
      await AuthRepository.findValidRefreshTokenByHash(refreshToken);

    if (storedToken) {
      await AuthRepository.revokeRefreshToken(storedToken._id);
    }
  } catch (err) {
    // Token invalid or expired, ignore
  }
};

/**
 * Get all active sessions for a user
 */
export const getUserSessions = async (userId) => {
  const sessions = await AuthRepository.getUserActiveSessions(userId);

  // Format sessions for client
  return sessions.map((session) => ({
    id: session._id,
    deviceName: session.deviceInfo?.deviceName,
    deviceType: session.deviceInfo?.deviceType,
    browser: session.deviceInfo?.browser,
    os: session.deviceInfo?.os,
    ipAddress: session.ipAddress,
    location: session.location,
    lastUsedAt: session.lastUsedAt,
    createdAt: session.createdAt,
    isSuspicious: session.isSuspicious,
    suspicionReason: session.suspicionReason,
  }));
};

/**
 * Revoke a specific session
 */
export const revokeSession = async (userId, sessionId) => {
  const session = await RefreshToken.findOne({
    _id: sessionId,
    userId,
    isRevoked: false,
  }).exec();

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  await AuthRepository.revokeRefreshToken(sessionId);
};

/**
 * Revoke all sessions except the current one
 */
export const revokeAllOtherSessions = async (userId, currentRefreshToken) => {
  if (!currentRefreshToken) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    // Find current session by comparing hashes
    const currentSession =
      await AuthRepository.findValidRefreshTokenByHash(currentRefreshToken);

    if (!currentSession) {
      throw new Error("FORBIDDEN");
    }

    // Verify the session belongs to this user
    if (currentSession.userId.toString() !== userId.toString()) {
      throw new Error("FORBIDDEN");
    }

    // Revoke all except current
    await AuthRepository.revokeAllOtherSessions(userId, currentSession._id);
  } catch (err) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      throw err;
    }
    throw new Error("FORBIDDEN");
  }
};

/**
 * Revoke all sessions for a user (e.g., on password change)
 */
export const revokeAllSessions = async (userId) => {
  await AuthRepository.revokeAllUserTokens(userId);
};

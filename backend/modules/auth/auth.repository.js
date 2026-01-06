import bcrypt from "bcryptjs";
import AuthUser from "./auth.model.js";
import RefreshToken from "./refreshToken.model.js";

export class AuthRepository {
  static findByUsername(username) {
    return AuthUser.findOne({ username }).lean().exec();
  }

  static findByEmail(email) {
    return AuthUser.findOne({ email }).lean().exec();
  }

  static findById(id) {
    return AuthUser.findById(id).lean().exec();
  }

  static async createUser(userData) {
    try {
      return await AuthUser.create(userData);
    } catch (err) {
      if (err.code === 11000) {
        err.isDuplicate = true;
      }
      throw err;
    }
  }

  static updatePassword(userId, hashedPassword) {
    return AuthUser.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
    );
  }

  static deleteById(userId) {
    return AuthUser.deleteOne({ _id: userId });
  }

  // ============================================
  // NEW: Device-based Refresh Token Methods
  // ============================================

  /**
   * Store a new refresh token with device information
   */
  static async storeRefreshToken(
    userId,
    tokenHash,
    deviceInfo,
    ipAddress,
    location,
    expiresAt,
    isSuspicious = false,
    suspicionReason = null,
  ) {
    const refreshToken = new RefreshToken({
      userId,
      tokenHash,
      deviceInfo,
      ipAddress,
      location,
      expiresAt,
      isSuspicious,
      suspicionReason,
    });

    return await refreshToken.save();
  }

  /**
   * Find a valid (non-revoked, non-expired) refresh token by userId and tokenHash
   */
  static async findValidRefreshToken(userId, tokenHash) {
    return await RefreshToken.findOne({
      userId,
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  /**
   * Find a valid refresh token by comparing hashes (for opaque tokens)
   * Returns the first valid token that matches the provided token
   */
  static async findValidRefreshTokenByHash(refreshToken) {
    // Get all valid tokens
    const validTokens = await RefreshToken.find({
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .populate("userId")
      .exec();

    // Check each token's hash against the provided token
    for (const storedToken of validTokens) {
      const isMatch = await bcrypt.compare(refreshToken, storedToken.tokenHash);
      if (isMatch) {
        return storedToken;
      }
    }

    return null;
  }

  /**
   * Update the last used timestamp for a token
   */
  static async updateRefreshTokenUsage(tokenId) {
    return await RefreshToken.findByIdAndUpdate(
      tokenId,
      { lastUsedAt: new Date() },
      { new: true },
    ).exec();
  }

  /**
   * Revoke a specific refresh token
   */
  static async revokeRefreshToken(tokenId) {
    return await RefreshToken.findByIdAndUpdate(
      tokenId,
      { isRevoked: true },
      { new: true },
    ).exec();
  }

  /**
   * Revoke all tokens for a user
   */
  static async revokeAllUserTokens(userId) {
    return await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    ).exec();
  }

  /**
   * Get all active (non-revoked, non-expired) sessions for a user
   */
  static async getUserActiveSessions(userId) {
    return await RefreshToken.find({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .select("-tokenHash")
      .sort({ lastUsedAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Get all sessions (including revoked) for suspicious activity detection
   */
  static async getAllUserSessions(userId) {
    return await RefreshToken.find({ userId })
      .select("deviceInfo ipAddress location createdAt")
      .sort({ createdAt: -1 })
      .limit(20) // Last 20 sessions
      .lean()
      .exec();
  }

  /**
   * Count active sessions for a user
   */
  static async countActiveSessions(userId) {
    return await RefreshToken.countDocuments({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  /**
   * Find oldest active session for a user
   */
  static async findOldestActiveSession(userId) {
    return await RefreshToken.findOne({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastUsedAt: 1 })
      .exec();
  }

  /**
   * Clean up expired tokens (optional, MongoDB TTL index handles this automatically)
   */
  static async cleanupExpiredTokens() {
    return await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    }).exec();
  }

  /**
   * Revoke all sessions except the current one
   */
  static async revokeAllOtherSessions(userId, currentTokenId) {
    return await RefreshToken.updateMany(
      {
        userId,
        _id: { $ne: currentTokenId },
        isRevoked: false,
      },
      { isRevoked: true },
    ).exec();
  }
}

import jwt from 'jsonwebtoken'
import AuthUser from './auth.model.js'
import RefreshToken from './refreshToken.model.js'
import { generateTokens } from '../../utils/generateTokens.js'
import { AuthRepository } from './auth.repository.js'
import { DuplicateUserError, InvalidCredentialsError } from './auth.errors.js'
import { detectSuspiciousActivity } from '../../utils/deviceParser.js'
import bcrypt from 'bcryptjs'

// Configuration
const MAX_DEVICES_PER_USER = 5
const REFRESH_TOKEN_EXPIRY_DAYS = 7

/**
 * Register a new user with device tracking
 */
export const registerUser = async ({ username, password }, deviceInfo, ipAddress, location) => {
  const found = await AuthRepository.findByUsername(username)

  if (found) {
    throw new DuplicateUserError()
  }

  const hashedPwd = await bcrypt.hash(password, 10)

  const user = await AuthRepository.createUser({
    username,
    password: hashedPwd
  })

  const tokens = generateTokens(user)
  const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10)
  
  // Calculate expiry
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  
  // First login is never suspicious
  await AuthRepository.storeRefreshToken(
    user._id,
    refreshTokenHash,
    deviceInfo,
    ipAddress,
    location,
    expiresAt,
    false,
    null
  )

  return tokens
}

/**
 * Login user with device tracking and suspicious activity detection
 */
export const loginUser = async ({ username, password }, deviceInfo, ipAddress, location) => {
  const foundUser = await AuthUser.findOne({ username }).select('+password').exec()

  if (!foundUser) {
    throw new InvalidCredentialsError()
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) throw new InvalidCredentialsError()

  // Check for suspicious activity
  const previousSessions = await AuthRepository.getAllUserSessions(foundUser._id)
  const { isSuspicious, reason } = detectSuspiciousActivity(deviceInfo, ipAddress, previousSessions)

  // Check device limit and enforce if needed
  const activeSessionCount = await AuthRepository.countActiveSessions(foundUser._id)
  
  if (activeSessionCount >= MAX_DEVICES_PER_USER) {
    // Revoke oldest session to make room
    const oldestSession = await AuthRepository.findOldestActiveSession(foundUser._id)
    if (oldestSession) {
      await AuthRepository.revokeRefreshToken(oldestSession._id)
    }
  }

  const tokens = generateTokens(foundUser)
  const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10)
  
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  
  await AuthRepository.storeRefreshToken(
    foundUser._id,
    refreshTokenHash,
    deviceInfo,
    ipAddress,
    location,
    expiresAt,
    isSuspicious,
    reason
  )

  return {
    tokens,
    isSuspicious,
    suspicionReason: reason
  }
}

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('UNAUTHORIZED')
  }

  const decoded = jwt.verify(refreshToken, process.env.refreshTokenSecret)

  const user = await AuthUser.findById(decoded.userId).exec()
  
  if (!user) {
    throw new Error('FORBIDDEN')
  }

  // Hash the incoming token to compare with stored hash
  const tokenHash = await bcrypt.hash(refreshToken, 10)
  
  // Find matching refresh token in database
  const storedToken = await AuthRepository.findValidRefreshToken(decoded.userId, tokenHash)
  
  if (!storedToken) {
    throw new Error('FORBIDDEN')
  }

  // Verify the token hash matches
  const isValid = await bcrypt.compare(refreshToken, storedToken.tokenHash)
  
  if (!isValid) {
    throw new Error('FORBIDDEN')
  }

  // Update last used timestamp
  await AuthRepository.updateRefreshTokenUsage(storedToken._id)

  // Generate NEW access token (keep same refresh token)
  const newAccessToken = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.accessTokenSecret,
    { expiresIn: '15m' }
  )

  return { accessToken: newAccessToken, refreshToken }
}

/**
 * Logout user from current device
 */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.refreshTokenSecret)
    const tokenHash = await bcrypt.hash(refreshToken, 10)
    
    // Find and revoke the specific token
    const storedToken = await AuthRepository.findValidRefreshToken(decoded.userId, tokenHash)
    
    if (storedToken) {
      await AuthRepository.revokeRefreshToken(storedToken._id)
    }
  } catch (err) {
    // Token invalid or expired, ignore
  }
}

/**
 * Get all active sessions for a user
 */
export const getUserSessions = async (userId) => {
  const sessions = await AuthRepository.getUserActiveSessions(userId)
  
  // Format sessions for client
  return sessions.map(session => ({
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
    suspicionReason: session.suspicionReason
  }))
}

/**
 * Revoke a specific session
 */
export const revokeSession = async (userId, sessionId) => {
  const session = await RefreshToken.findOne({
    _id: sessionId,
    userId,
    isRevoked: false
  }).exec()
  
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }
  
  await AuthRepository.revokeRefreshToken(sessionId)
}

/**
 * Revoke all sessions except the current one
 */
export const revokeAllOtherSessions = async (userId, currentRefreshToken) => {
  if (!currentRefreshToken) {
    throw new Error('UNAUTHORIZED')
  }

  try {
    const decoded = jwt.verify(currentRefreshToken, process.env.refreshTokenSecret)
    const tokenHash = await bcrypt.hash(currentRefreshToken, 10)
    
    const currentSession = await AuthRepository.findValidRefreshToken(decoded.userId, tokenHash)
    
    if (!currentSession) {
      throw new Error('FORBIDDEN')
    }
    
    // Revoke all except current
    await AuthRepository.revokeAllOtherSessions(userId, currentSession._id)
  } catch (err) {
    if (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN') {
      throw err
    }
    throw new Error('FORBIDDEN')
  }
}

/**
 * Revoke all sessions for a user (e.g., on password change)
 */
export const revokeAllSessions = async (userId) => {
  await AuthRepository.revokeAllUserTokens(userId)
}

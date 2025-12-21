import jwt from 'jsonwebtoken'
import AuthUser from './auth.model.js'
import { generateTokens } from '../../utils/generateTokens.js'
import { AuthRepository } from './auth.repository.js'
import { DuplicateUserError, InvalidCredentialsError } from './auth.errors.js'
import bcrypt from 'bcryptjs'

export const registerUser = async ({ username, password }) => {

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
  
  await AuthRepository.storeRefreshTokenHash(user._id, refreshTokenHash)

  return tokens

}

export const loginUser = async ({ username, password }) => {

  const foundUser = await AuthUser.findOne({ username }).select('+password').exec()

  if (!foundUser) {
    throw new InvalidCredentialsError()
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) throw new InvalidCredentialsError()

  const tokens = generateTokens(foundUser)
  const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10)
  
  await AuthRepository.storeRefreshTokenHash(foundUser._id, refreshTokenHash)

  return tokens
}

export const refreshAccessToken = async (refreshToken) => {
  
  if (!refreshToken) {
    throw new Error('UNAUTHORIZED')
  }

  // 1. Verify JWT signature and expiration
  const decoded = jwt.verify(refreshToken, process.env.refreshTokenSecret)

  // 2. Get user from database with refresh token hash
  const user = await AuthUser.findById(decoded.userId).select('+refreshTokenHash').exec()
  
  if (!user || !user.refreshTokenHash) {
    throw new Error('FORBIDDEN')
  }

  // 3. Validate refresh token against stored hash
  const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash)
  
  if (!isValid) {
    throw new Error('FORBIDDEN')
  }

  // 4. Generate NEW tokens (TOKEN ROTATION)
  const newTokens = generateTokens(user)
  
  // 5. Hash and store NEW refresh token
  const newRefreshTokenHash = await bcrypt.hash(newTokens.refreshToken, 10)
  await AuthRepository.storeRefreshTokenHash(user._id, newRefreshTokenHash)

  // 6. Return new tokens
  return newTokens
}

export const logoutUser = async (refreshToken) => {
  
  if (!refreshToken) {
    return // Already logged out
  }

  try {
    // Verify token to get userId
    const decoded = jwt.verify(refreshToken, process.env.refreshTokenSecret)
    
    // REVOKE: Delete hash from database
    await AuthRepository.clearRefreshToken(decoded.userId)
  } catch (err) {
    // Token invalid or expired, ignore error
    // Still proceed with cookie clearing
  }
}
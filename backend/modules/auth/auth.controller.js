import { cookieOptions } from '../../utils/cookieOptions.js'
import * as authService from './auth.service.js'
import { parseDeviceInfo, getClientIp, getLocationFromIp } from '../../utils/deviceParser.js'


export const register = async (request, response, next) => {
  try {
    
    const userAgent = request.headers['user-agent']
    const deviceInfo = parseDeviceInfo(userAgent, request.body.deviceName)
    const ipAddress = getClientIp(request)
    const location = getLocationFromIp(ipAddress)

    const tokens = await authService.registerUser(
      request.body,
      deviceInfo,
      ipAddress,
      location
    )

    response.cookie('refresh-token', tokens.refreshToken, cookieOptions)

    return response.status(201).json({
      message: "Signup successful",
      accessToken: tokens.accessToken
    })
  } catch (err) {
    next(err)
  }
}


export const login = async (req, res, next) => {
  try {
    
    const userAgent = req.headers['user-agent']
    const deviceInfo = parseDeviceInfo(userAgent, req.body.deviceName)
    const ipAddress = getClientIp(req)
    const location = getLocationFromIp(ipAddress)

    const result = await authService.loginUser(
      req.body,
      deviceInfo,
      ipAddress,
      location
    )

    res.cookie("jwt", result.tokens.refreshToken, cookieOptions)

    // Include suspicious activity warning in response
    const responseData = {
      message: "Login successful",
      accessToken: result.tokens.accessToken
    }

    if (result.isSuspicious) {
      responseData.warning = {
        isSuspicious: true,
        reason: result.suspicionReason,
        message: "This login appears unusual. If this wasn't you, please secure your account."
      }
    }

    return res.status(200).json(responseData)
  } catch (err) {
    next(err)
  }
}

/**
 * Refresh access token
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.jwt

    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const tokens = await authService.refreshAccessToken(refreshToken)

    // Keep same refresh token in cookie
    res.cookie('jwt', tokens.refreshToken, cookieOptions)

    return res.status(200).json({
      message: 'Token refreshed',
      accessToken: tokens.accessToken
    })
  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    
    if (err.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next(err)
  }
}

/**
 * Logout user from current device
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.jwt

    if (!refreshToken) {
      return res.sendStatus(204)
    }

    await authService.logoutUser(refreshToken)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    
    return res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * Get all active sessions for the current user
 */
export const getSessions = async (req, res, next) => {
  try {
    const userId = req.auth.userId // From auth middleware
    
    const sessions = await authService.getUserSessions(userId)
    
    return res.json({
      message: 'Sessions retrieved successfully',
      count: sessions.length,
      sessions
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Revoke a specific session
 */
export const revokeSession = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const { sessionId } = req.params
    
    await authService.revokeSession(userId, sessionId)
    
    return res.json({
      message: 'Session revoked successfully',
      sessionId
    })
  } catch (err) {
    if (err.message === 'SESSION_NOT_FOUND') {
      return res.status(404).json({ message: 'Session not found' })
    }
    next(err)
  }
}

/**
 * Revoke all sessions except the current one
 */
export const revokeAllOtherSessions = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const refreshToken = req.cookies?.jwt
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    
    await authService.revokeAllOtherSessions(userId, refreshToken)
    
    return res.json({
      message: 'All other sessions revoked successfully'
    })
  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (err.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next(err)
  }
}

/**
 * Revoke all sessions (logout from all devices)
 */
export const revokeAllSessions = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    
    await authService.revokeAllSessions(userId)
    
    // Clear current cookie too
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    
    return res.json({
      message: 'Logged out from all devices successfully'
    })
  } catch (err) {
    next(err)
  }
}

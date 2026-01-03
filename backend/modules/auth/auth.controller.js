import { cookieOptions } from '../../utils/cookieOptions.js'
import * as authService from './auth.service.js'

  export const register = async (request, response, next) => {

  try {

    const tokens = await authService.registerUser(request.body);

    response.cookie('jwt', tokens.refreshToken, cookieOptions)

    return response.status(201).json({ message: "Signup successful", accessToken: tokens.accessToken });

  } catch (err) {

    next(err)

  }

  }

export const login = async (req, res, next) => {

  try {

    const tokens = await authService.loginUser(req.body);

  res.cookie("jwt", tokens.refreshToken, cookieOptions);

  return res.status(200).json({

    message: "Login successful", accessToken: tokens.accessToken

  });

  } catch (err) {

    next(err);

  }

}

export const refresh = async (req, res, next) => {
  
  try {
    
    const refreshToken = req.cookies?.jwt

    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const tokens = await authService.refreshAccessToken(refreshToken)

    // Set new refresh token in cookie
    res.cookie('jwt', tokens.refreshToken, cookieOptions)

    // Send new access token
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


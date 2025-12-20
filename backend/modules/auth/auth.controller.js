import { cookieOptions } from '../../utils/cookieOptions.js'
import * as authService from './auth.service.js'

export const register = async (request, response, next) => {

  try {

    const tokens = await authService.registerUser(request.body);

    response.cookie('jwt', tokens.refreshToken, cookieOptions)

    return response.status(201).json({
      message: "Signup successful", accessToken: tokens.accessToken
    });

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

export const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}
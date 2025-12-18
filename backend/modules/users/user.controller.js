import { User } from '../models/User.js'
import { cookieOptions } from '../utils/cookieOptions.js'
import * as userService from './user.service.js'

export const register = async (request, response, next) => {

  try {

    const tokens = await userService.registerUser(request.body);

    response.cookie('jwt', tokens.refreshToken, cookieOptions)

    return response.status(201).json({
      message: "Signup successful", accessToken: tokens.accessToken
    });

  } catch (err) {

    next(err)

  }

}

export const login = async (req, res, next) => {

  const tokens = await userService.loginUser(req.body);

  res.cookie("jwt", tokens.refreshToken, cookieOptions);

  return res.status(200).json({
    message: "Login successful", accessToken: tokens.accessToken
  });




}

export const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}

export const refresh = async (req, res, next) => {
  try {
    const accessToken = await userService.refreshAccessToken(req.cookies?.jwt);
    res.json({ accessToken });
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await updateUser(req.userId, req.body);

    res.json({
      message: `${result.username} updated`
    });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    if (err.message === "USERNAME_TAKEN") {
      return res.status(409).json({ message: "Username already taken" });
    }

    next(err);
  }
};

export const deleteUser = async (req, res) => {

  const id = req.userId


  if (!id) {
    return res.status(400).json({ message: 'User ID Required' })
  }



  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `Username ${result.username} with ID ${result._id} deleted`

  res.json(reply)
}



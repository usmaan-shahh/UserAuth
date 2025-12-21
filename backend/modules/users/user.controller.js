import * as userService from './user.service.js'

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId  // From verifyJWT middleware

    const user = await userService.getUserProfile(userId)

    return res.status(200).json({
      profile: user
    })

  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" })
    }

    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.auth.userId  // From verifyJWT middleware

    const result = await userService.updateUser(userId, req.body)

    return res.status(200).json({
      message: "User updated successfully",
      user: result
    })

  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" })
    }

    if (err.message === "USERNAME_TAKEN") {
      return res.status(409).json({ message: "Username already taken" })
    }

    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.auth.userId  // From verifyJWT middleware

    await userService.deleteUser(userId)

    return res.status(200).json({
      message: "User deleted successfully"
    })

  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" })
    }

    next(err)
  }
}



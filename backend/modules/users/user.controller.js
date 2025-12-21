import { cookieOptions } from '../../utils/cookieOptions.js'
import * as userService from './user.service.js'


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



import bcrypt from 'bcryptjs'
import User from './user.model.js'
import { generateTokens } from '../../utils/generateTokens.js'
import { AuthRepository } from './auth.repository.js'

export const registerUser = async ({ username, password }) => {

    const found = await AuthRepository.findByUsername(username)

    if (found) {
      throw new DuplicateUserError()
    }

  const hashedPwd = await bcrypt.hash(password, 10)

  const user = await AuthRepository.create({
    username,
    password: hashedPwd
  })

  return generateTokens(user)

}

export const loginUser = async ({ username, password }) => {

  const foundUser = await User.findOne({ username }).exec()

  if (!foundUser) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: 'Unauthorized' })

  return generateTokens(foundUser)
}

export const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}
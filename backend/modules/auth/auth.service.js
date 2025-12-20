import bcrypt from 'bcryptjs'
import AuthUser from './auth.model.js'
import { generateTokens } from '../../utils/generateTokens.js'
import { AuthRepository } from './auth.repository.js'
import { DuplicateUserError, InvalidCredentialsError } from './auth.errors.js'

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

  return generateTokens(user)

}

export const loginUser = async ({ username, password }) => {

  const foundUser = await AuthUser.findOne({ username }).select('+password').exec()

  if (!foundUser) {
    throw new InvalidCredentialsError()
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) throw new InvalidCredentialsError()

  return generateTokens(foundUser)
}

export const logoutUser = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}
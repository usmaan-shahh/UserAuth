import bcrypt from 'bcryptjs'
import AuthUser from '../auth/auth.model.js'
import { UserRepository } from './user.repository.js'

export const getUserProfile = async (userId) => {
  
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  // Return user without sensitive fields
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export const updateUser = async (userId, payload) => {

  const user = await AuthUser.findById(userId).exec()

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  // Check if username is being changed and if it's already taken
  if (payload.username && payload.username !== user.username) {
    const duplicate = await AuthUser.findOne({ username: payload.username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec()

    // Prevent updating to a username that already exists
    if (duplicate && duplicate._id.toString() !== userId) {
      throw new Error("USERNAME_TAKEN")
    }

    user.username = payload.username
  }

  // Update password if provided
  if (payload.password) {
    user.password = await bcrypt.hash(payload.password, 10)
  }

  // Update email if provided
  if (payload.email) {
    user.email = payload.email
    user.isEmailVerified = false  // Reset verification if email changed
  }

  const updatedUser = await user.save()

  // Return user without sensitive fields
  return {
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    roles: updatedUser.roles,
    isEmailVerified: updatedUser.isEmailVerified
  }
}

export const deleteUser = async (userId) => {

  const user = await AuthUser.findById(userId).exec()

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  await user.deleteOne()

  return {
    message: `User ${user.username} deleted successfully`
  }
}



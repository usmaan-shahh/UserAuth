import AuthUser from '../auth/auth.model.js'

export class UserRepository {

  static findById(id) {
    return AuthUser.findById(id)
      .select('-password -refreshTokenHash')  // Exclude sensitive fields
      .lean()
      .exec()
  }

  static findByUsername(username) {
    return AuthUser.findOne({ username })
      .select('-password -refreshTokenHash')
      .lean()
      .exec()
  }

  static findByEmail(email) {
    return AuthUser.findOne({ email })
      .select('-password -refreshTokenHash')
      .lean()
      .exec()
  }

  static updateUser(userId, updateData) {
    return AuthUser.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-password -refreshTokenHash')
      .exec()
  }

  static deleteUser(userId) {
    return AuthUser.findByIdAndDelete(userId).exec()
  }
}


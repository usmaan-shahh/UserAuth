import AuthUser from './auth.model.js'

export class AuthRepository {


  static findByUsername(username) {
    return AuthUser.findOne({ username })
      .lean()
      .exec()
  }

  static findByEmail(email) {
    return AuthUser.findOne({ email })
      .lean()
      .exec()
  }


  static findById(id) {
    return AuthUser.findById(id)
      .lean()
      .exec()
  }


  static async createUser(userData) {
    try {
      return await AuthUser.create(userData)
    } catch (err) {
      if (err.code === 11000) {
        err.isDuplicate = true
      }
      throw err
    }
  }


  static updatePassword(userId, hashedPassword) {
    return AuthUser.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    )
  }

  static updateRefreshToken(userId, refreshTokenHash) {
    return AuthUser.updateOne(
      { _id: userId },
      { $set: { refreshTokenHash } }
    )
  }


  static clearRefreshToken(userId) {
    return AuthUser.updateOne(
      { _id: userId },
      { $unset: { refreshTokenHash: 1 } }
    )
  }


  static deleteById(userId) {
    return AuthUser.deleteOne({ _id: userId })
  }
}

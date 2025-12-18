import User from './auth.model.js'

export class AuthRepository {

  static findByUsername(username) {
    return User.findOne({ username })
      .collation({ locale: 'en', strength: 2 }) // case-insensitive
      .lean()
      .exec()
  }

  static findById(id) {
    return User.findById(id)
      .lean()
      .exec()
  }

  static create(userData) {
    return User.create(userData)
  }

  static updatePassword(userId, hashedPassword) {
    return User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    )
  }

  static deleteById(userId) {
    return User.deleteOne({ _id: userId })
  }
}

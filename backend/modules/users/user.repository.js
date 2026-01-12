import AuthUser from "../auth/auth.model.js";

export class UserRepository {
  static findById(id) {
    return AuthUser.findById(id)
      .select("-password -refreshTokenHash") // Exclude sensitive fields
      .lean()
      .exec();
  }

  static findAll() {
    return AuthUser.find()
      .select("-password -refreshTokenHash") // Exclude sensitive fields
      .lean()
      .exec();
  }
}

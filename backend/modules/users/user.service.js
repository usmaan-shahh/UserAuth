import bcrypt from "bcryptjs";
import AuthUser from "../auth/auth.model.js";
import { UserRepository } from "./user.repository.js";

export const getUserProfile = async (userId) => {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

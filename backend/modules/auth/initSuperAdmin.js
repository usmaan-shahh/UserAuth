import bcrypt from "bcryptjs";
import AuthUser from "./auth.model.js";
import logger from "../../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

export const ensureSuperAdminExists = async () => {

  try {
    const username = process.env.SUPER_ADMIN_USERNAME;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!username || !password) {
      logger.warn("Super admin credentials not set in environment variables");
      return;
    }

  
    const existingAdmin = await AuthUser.findOne({ username }).exec();

    if (existingAdmin) {
      logger.info(`Super admin '${username}' already exists`);
      return;
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await AuthUser.create({
      username,
      password: hashedPassword,
      roles: ["admin"],
    });

    logger.info(`Super admin '${username}' created successfully`);
  } catch (error) {
    logger.error("Failed to ensure super admin exists:", error);
  }
};
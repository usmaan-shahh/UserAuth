import express from "express";
import { authorize, validate, verifyJWT } from "../../middleware/index.js";
import * as userController from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";

const router = express.Router();

// All user routes require authentication
router.use(verifyJWT);

// Get current user profile
router.get("/profile", authorize("readOwn", "profile"), userController.getProfile);

// Update current user
router.patch("/profile", authorize("updateOwn", "profile"), validate(updateUserSchema), userController.updateUser);

// Delete current user account
router.delete("/account", authorize("deleteOwn", "account"), userController.deleteUser);

export default router;

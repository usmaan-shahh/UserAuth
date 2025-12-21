import express from "express"
import * as userController from "./user.controller.js"
import { verifyJWT, validate } from "../../middleware/index.js"
import { updateUserSchema } from "./user.schema.js"

const router = express.Router()

// All user routes require authentication
router.use(verifyJWT)

// Get current user profile
router.get("/profile", userController.getProfile)

// Update current user
router.patch("/profile", validate(updateUserSchema), userController.updateUser)

// Delete current user account
router.delete("/account", userController.deleteUser)

export default router


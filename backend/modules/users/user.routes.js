import express from "express";
import { authorize, validate, verifyJWT } from "../../middleware/index.js";
import * as userController from "./user.controller.js";

const router = express.Router();

// All user routes require authentication
router.use(verifyJWT);

// Get current user profile
router.get("/profile", authorize("readOwn", "profile"), userController.getProfile);


export default router;

import express from "express";
import * as userController from "../modules/users/user.controller.js";
import { loginLimiter } from "../middleware/index.js"


const router = express.Router();

router.post("/register", userController.register);

router.post("/login", loginLimiter, userController.login);

router.post("/logout", userController.logout)


export default router
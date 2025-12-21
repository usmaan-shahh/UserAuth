import express from "express";
import * as authController from "./auth.controller.js";
import { loginLimiter } from "../../middleware/index.js"


const router = express.Router();

router.post("/register", authController.register);

router.post("/login", loginLimiter, authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout)


export default router
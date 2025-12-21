import express from "express";
import * as authController from "./auth.controller.js";
import { loginLimiter } from "../../middleware/index.js"
import { validate } from "middleware/validate.js";
import { registerSchema } from "./auth.schema.js";


const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", loginLimiter, authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout)


export default router
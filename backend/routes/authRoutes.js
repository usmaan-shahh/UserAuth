import express from "express";
const router = express.Router();
import { login, logout, refresh } from "../controllers/authController.js";
import loginLimiter from "../middleware/rateLimiter.js";


router.post("/login", loginLimiter, login);

router.get('/refresh', refresh)

router.post("/logout", logout)

export default router;

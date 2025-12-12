import express from "express";
const router = express.Router();
import { login } from "../controllers/authController.js";
import loginLimiter from "../middleware/rateLimiter.js";


router.post("/login", loginLimiter, login);


export default router;

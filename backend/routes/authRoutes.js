import express from "express";
const router = express.Router();
import { signupRouteHandler } from "../routeHandlers/signupRouteHandler.js";
import { verifyEmail } from "../routeHandlers/verifyEmailRouteHandler.js";
import { logoutRouteHandler } from "../routeHandlers/logoutRouteHandler.js";
import { loginRouteHandler } from "../routeHandlers/loginRouteHandler.js";
import { forgetPasswordRoutehandler } from "../routeHandlers/forgotPasswordRouteHandler.js";
import { resetPasswordRouteHandler } from "../routeHandlers/resetPasswordRouteHandler.js";
import { verifyToken } from "../middleware/verifyToken.js";
import checkAuthRouteHandler from "../routeHandlers/checkAuthRouteHandler.js";

router.post("/signup", signupRouteHandler);
router.post("/verify-email", verifyEmail);
router.post("/logout", logoutRouteHandler);
router.post("/login", loginRouteHandler);
router.post("/reset-password", forgetPasswordRoutehandler);
router.post("/reset-password/:token", resetPasswordRouteHandler);
router.get("/check-auth", verifyToken, checkAuthRouteHandler);

export default router;

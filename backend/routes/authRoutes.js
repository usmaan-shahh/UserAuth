import express from "express";
import { signupRouteHandler } from "../routeHandlers/signupRouteHandler.js";
import { verifyEmail } from "../routeHandlers/verifyEmailRouteHandler.js";
import { logoutRouteHandler } from "../routeHandlers/logoutRouteHandler.js";
import { loginRouteHandler } from "../routeHandlers/loginRouteHandler.js";

const router = express.Router();

router.post("/signup", signupRouteHandler);
router.post("/verify-email", verifyEmail);
router.post("/logout", logoutRouteHandler);
router.post("/login", loginRouteHandler);

export default router;

import express from "express";
const router = express.Router();
import loginRouteHandler from "../../routeHandlers/loginRouteHandler.js";

router.get("/refresh", verifyToken, checkAuthRouteHandler);
router.post("/signup", loginLimiter, signupRouteHandler);

router.post("/logout", logoutRouteHandler);
router.post("/login", loginRouteHandler);


export default router;

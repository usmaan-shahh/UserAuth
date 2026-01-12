import express from "express";
import { authorize, loginLimiter } from "../../middleware/index.js";
import validate from "../../middleware/validate.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import * as authController from "./auth.controller.js";
import { createAdminSchema, loginSchema, registerSchema } from "./auth.schema.js";

const router = express.Router();

router.post(
  "/admin/create",
  verifyJWT,
  authorize("createAny", "admin"),
  validate(createAdminSchema),
  authController.createAdmin
);

router.post("/register", validate(registerSchema),authController.register);

router.post(
  "/login",
  validate(loginSchema),
  loginLimiter,
  authController.login,
);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

// // Protected session management routes
// router.get("/sessions", verifyJWT, authController.getSessions);

// router.delete("/sessions/:sessionId", verifyJWT, authController.revokeSession);

// router.post(
//   "/sessions/revoke-all-others",
//   verifyJWT,
//   authController.revokeAllOtherSessions,
// );

// router.post(
//   "/sessions/revoke-all",
//   verifyJWT,
//   authController.revokeAllSessions,
// );

export default router;

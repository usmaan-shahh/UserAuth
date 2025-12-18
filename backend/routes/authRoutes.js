import express from "express";

import { loginLimiter } from "../middleware/index.js"


const router = express.Router();


// router.get('/refresh', userController.refresh)

// router.patch('/update', validate(updateUserSchema), userController.updateUser);

// router.delete('/delete', validate(deleteUserSchema), userController.deleteUser);

export default router;

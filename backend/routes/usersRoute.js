import express from 'express';
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validate } from "../middleware/validate.js";
import {publicSignupSchema} from "../schemas/signUpSchema.js";
const router = express.Router();


router.post('/',validate(publicSignupSchema), createNewUser);


router.get('/', verifyJWT, getAllUsers);
router.patch('/', verifyJWT, updateUser);
router.delete('/', verifyJWT, deleteUser);

export default router;

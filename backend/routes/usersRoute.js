import express from 'express';
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validate } from "../middleware/validate.js";
import {publicSignupSchema} from "../schemas/signUpSchema.js";
import { updateUserSchema } from '../schemas/updateUserSchema.js';



const router = express.Router();

router.post('/',validate(publicSignupSchema), createNewUser);
router.patch('/update', verifyJWT, validate(updateUserSchema), updateUser);



router.get('/', verifyJWT, getAllUsers);
router.delete('/', verifyJWT, deleteUser);

export default router;

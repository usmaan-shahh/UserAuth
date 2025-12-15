import express from 'express';
/* ----------------------- Controllers ----------------------- */
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/usersController.js';

/* ----------------------- Schemas ----------------------- */
import { publicSignupSchema, updateUserSchema, deleteUserSchema } from '../schemas/index.js';

/* ----------------------- Middlewares ----------------------- */
import {verifyJWT, validate} from '../middleware/index.js'


const router = express.Router();

/* -----------------------PUBLIC ROUTES----------------------- */
router.post('/', validate(publicSignupSchema), createNewUser); 
/* ----------------------- PROTECTED ROUTES ------------------- */
router.use(verifyJWT);  
router.get('/', getAllUsers);
router.patch('/update',validate(updateUserSchema), updateUser);
router.delete('/delete',validate(deleteUserSchema), deleteUser);
  export default router;
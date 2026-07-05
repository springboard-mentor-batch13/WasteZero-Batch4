import express from 'express';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { registerUser, loginUser } from '../controller/authController.js';
const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;

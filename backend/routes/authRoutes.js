import express from 'express';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { registerUser, loginUser, logoutUser } from '../controller/authController.js';
const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);

export default router;

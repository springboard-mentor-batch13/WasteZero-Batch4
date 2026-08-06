import express from 'express';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { registerUser, loginUser, logoutUser } from '../controller/authController.js';
import { rateLimit } from '../middleware/rateLimit.js';
const router = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);

export default router;

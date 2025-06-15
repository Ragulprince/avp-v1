
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimiter';
import {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} from '../controllers/authController';

const router = Router();

router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.get('/profile', authenticate, getProfile);

export default router;

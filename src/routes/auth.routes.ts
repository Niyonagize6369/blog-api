import express, { Router } from 'express';
import { 
  signup, 
  verifyEmail, 
  login, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  signupSchema, 
  verifyEmailSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../schemas/auth.schemas';

const router: Router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default router;
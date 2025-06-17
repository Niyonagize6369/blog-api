import express, { Router } from 'express';
import { 
  signup, 
  verifyEmail, 
  login, 
  forgotPassword, 
  resetPassword, 
  resendVerificationEmail
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  signupSchema, 
  verifyEmailSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  ResendVerificationInput
} from '../schemas/auth.schemas';

const router: Router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('auth/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('auth/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.post('/resend-verification', validate(ResendVerificationInput), resendVerificationEmail);

export default router;
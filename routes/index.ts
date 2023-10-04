import { Router } from 'express';
import { newDbHandler } from './db';
import {
  handleConfirmOtp,
  handleSignIn,
  handleSignUp,
  handleRefreshToken,
  meHandler,
  logoutHandler,
} from './auth';
import { auth } from 'libs/middleware';

const router = Router();

router.post('/newdb/:type', auth, newDbHandler.validate, newDbHandler.handler);
router.post('/signup', handleSignUp.validate, handleSignUp.handler);
router.post('/signin', handleSignIn.validate, handleSignIn.handler);
router.post('/confirm-otp', handleConfirmOtp.validateReq, handleConfirmOtp.handler);
router.post('/refresh-token', handleRefreshToken.validate, handleRefreshToken.handler);
router.get('/logout', logoutHandler);
router.get('/me', meHandler.handler);

// TEST
router.get('/hello', (req, res) => {
  res.send({
    message: 'Hello World!',
  });
});

export { router };

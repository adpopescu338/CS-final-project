import { Router } from 'express';
import * as handleCreateUser from './newdb';
import { handleConfirmOtp, handleSignIn, handleSignUp, handleRefreshToken } from './auth';
import { auth } from 'libs/middleware';

const router = Router();

router.post('/newdb/:type', auth, handleCreateUser.validateReq, handleCreateUser.handler);
router.post('/signup', handleSignUp.validateReq, handleSignUp.handler);
router.post('/signin', handleSignIn.validateReq, handleSignIn.handler);
router.post('/confirm-otp', handleConfirmOtp.validateReq, handleConfirmOtp.handler);
router.post('/refresh-token', handleRefreshToken.validateReq, handleRefreshToken.handler);

// TEST
router.get('/hello', (req, res) => {
  res.send({
    message: 'Hello World!',
  });
});

export { router };

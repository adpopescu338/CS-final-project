import { Router } from 'express';
import { validate, auth } from 'libs/middleware';
import * as handleCreateUser from './newdb';
import * as handleSignup from './signup';
import * as handleSignin from './signin';

const router = Router();

router.post('/newdb/:type', auth, validate(handleCreateUser.schema), handleCreateUser.handler);
router.post('/signup', validate(handleSignup.schema), handleSignup.handler);
router.post('/signin', validate(handleSignin.schema), handleSignin.handler);

export { router };

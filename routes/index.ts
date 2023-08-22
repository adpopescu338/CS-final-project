import { Router } from 'express';
import * as handleCreateUser from './newdb';
import { validate } from '../lib/middleware';

const router = Router();

router.post('/newdb/:type', validate(handleCreateUser.schema), handleCreateUser.handler);

export { router };

import { Router } from 'express';
import { handleCreateUser } from './newdb';

const router = Router();

router.post('/newdb/:type', handleCreateUser);

export { router };

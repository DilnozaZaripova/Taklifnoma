import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const userController = new UserController();

router.get('/stats', authenticate, (req, res) => userController.getStats(req, res));

export default router;

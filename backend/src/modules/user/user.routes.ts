import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const userController = new UserController();

router.get('/stats', authenticate, (req, res) => userController.getStats(req, res));
router.get('/profile', authenticate, (req, res) => userController.getProfile(req, res));
router.put('/profile', authenticate, (req, res) => userController.updateProfile(req, res));
router.put('/password', authenticate, (req, res) => userController.changePassword(req, res));

export default router;

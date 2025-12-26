import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();
const adminController = new AdminController();

router.get('/stats', authenticate, authorize(['ADMIN']), (req, res) => adminController.getStats(req as any, res));
router.get('/users', authenticate, authorize(['ADMIN']), (req, res) => adminController.listUsers(req as any, res));

export default router;

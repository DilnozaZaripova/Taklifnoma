import { Router } from 'express';
import { NotificationController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticate, (req, res) => notificationController.getNotifications(req, res));
router.get('/unread-count', authenticate, (req, res) => notificationController.getUnreadCount(req, res));
router.put('/:id/read', authenticate, (req, res) => notificationController.markAsRead(req, res));
router.put('/mark-all-read', authenticate, (req, res) => notificationController.markAllAsRead(req, res));
router.delete('/:id', authenticate, (req, res) => notificationController.deleteNotification(req, res));

export default router;

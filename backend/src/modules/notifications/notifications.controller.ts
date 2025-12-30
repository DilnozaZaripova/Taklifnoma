import { Request, Response } from 'express';
import { NotificationService } from './notifications.service';
import { AuthRequest } from '../../middlewares/auth';

const notificationService = new NotificationService();

export class NotificationController {
    async getNotifications(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const notifications = await notificationService.getNotificationsByUser(userId);

            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error: any) {
            console.error('Get notifications error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getUnreadCount(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const count = await notificationService.getUnreadCount(userId);

            res.status(200).json({
                success: true,
                data: { count }
            });
        } catch (error: any) {
            console.error('Get unread count error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async markAsRead(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await notificationService.markAsRead(id);

            res.status(200).json({
                success: true,
                message: 'O\'qildi deb belgilandi'
            });
        } catch (error: any) {
            console.error('Mark as read error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async markAllAsRead(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            await notificationService.markAllAsRead(userId);

            res.status(200).json({
                success: true,
                message: 'Barcha bildirishnomalar o\'qildi'
            });
        } catch (error: any) {
            console.error('Mark all as read error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async deleteNotification(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await notificationService.deleteNotification(id);

            res.status(200).json({
                success: true,
                message: 'Bildirishnoma o\'chirildi'
            });
        } catch (error: any) {
            console.error('Delete notification error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

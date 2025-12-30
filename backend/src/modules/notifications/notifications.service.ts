import prisma from '../../config/db';

export class NotificationService {
    async createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type: 'RSVP' | 'GIFT' | 'MEDIA' | 'SYSTEM';
    }) {
        return await prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type
            }
        });
    }

    async getNotificationsByUser(userId: string, limit: number = 50) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getUnreadCount(userId: string) {
        return await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
    }

    async markAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        });
    }

    async deleteNotification(id: string) {
        return await prisma.notification.delete({
            where: { id }
        });
    }
}

import prisma from '../../config/db';

export class ActivityLogService {
    async logActivity(data: {
        userId: string;
        weddingId?: string;
        activityType: string;
        description: string;
        metadata?: any;
    }) {
        return await prisma.activityLog.create({
            data: {
                userId: data.userId,
                weddingId: data.weddingId,
                activityType: data.activityType,
                description: data.description,
                metadata: data.metadata ? JSON.stringify(data.metadata) : null
            }
        });
    }

    async getActivitiesByUser(userId: string, limit: number = 50) {
        return await prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getActivitiesByWedding(weddingId: string, limit: number = 100) {
        return await prisma.activityLog.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async deleteActivity(id: string) {
        return await prisma.activityLog.delete({
            where: { id }
        });
    }
}

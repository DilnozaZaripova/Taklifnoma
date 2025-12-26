import prisma from '../../config/db';

export class AdminService {
    async getStats() {
        const [userCount, weddingCount, giftStats, mediaCount, invitationCount] = await Promise.all([
            prisma.user.count(),
            prisma.wedding.count(),
            prisma.gift.aggregate({
                _sum: { amount: true },
                _count: true
            }),
            prisma.media.count(),
            prisma.invitation.count()
        ]);

        return {
            totalUsers: userCount,
            totalWeddings: weddingCount,
            totalGiftsAmount: giftStats._sum.amount || 0,
            totalGiftsCount: giftStats._count,
            totalMedia: mediaCount,
            totalAIGenerations: invitationCount
        };
    }

    async listUsers() {
        return prisma.user.findMany({
            select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true }
        });
    }
}

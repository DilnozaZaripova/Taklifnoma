import prisma from '../../config/db';

export class GiftsService {
    async sendGift(weddingId: string, data: any) {
        const { guestName, amount, message } = data;

        const newGift = await prisma.gift.create({
            data: {
                weddingId,
                guestName,
                amount: parseFloat(amount),
                message
            }
        });
        return newGift;
    }

    async getByWedding(weddingId: string, userId: string) {
        // First verify wedding ownership
        const wedding = await prisma.wedding.findFirst({
            where: { id: weddingId, userId }
        });

        if (!wedding) {
            throw new Error('Ruxsat berilmagan yoki to\'y topilmadi');
        }

        const gifts = await prisma.gift.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' }
        });

        const totalAmount = gifts.reduce((sum, gift) => sum + gift.amount, 0);

        return { gifts, totalAmount };
    }
}

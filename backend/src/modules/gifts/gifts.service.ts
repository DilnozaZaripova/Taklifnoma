import db from '../../config/db';
import { randomUUID } from 'crypto';

export class GiftsService {
    async sendGift(weddingId: string, data: any) {
        const { guestName, amount, message } = data;
        const id = randomUUID();

        const newGift = {
            id,
            weddingId,
            guestName,
            amount: parseFloat(amount),
            message,
            createdAt: new Date().toISOString()
        };

        await db.insert('gifts', newGift);
        return newGift;
    }

    async getByWedding(weddingId: string, userId: string) {
        await (db as any).load();
        const wedding = (db as any).data.weddings.find((w: any) => w.id === weddingId && w.userId === userId);

        if (!wedding) {
            throw new Error('Ruxsat berilmagan yoki to\'y topilmadi');
        }

        const gifts = (db as any).data.gifts.filter((g: any) => g.weddingId === weddingId);
        const totalAmount = gifts.reduce((sum: number, gift: any) => sum + gift.amount, 0);

        return { gifts, totalAmount };
    }
}

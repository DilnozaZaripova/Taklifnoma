import { Request, Response } from 'express';
import prisma from '../../config/db';

export class GiftsController {
    async createGift(req: Request, res: Response) {
        try {
            const { weddingId, guestName, amount, message } = req.body;

            if (!weddingId || !guestName || !amount) {
                res.status(400).json({ success: false, message: "Ma'lumotlar yetarli emas" });
                return;
            }

            const newGift = await prisma.gift.create({
                data: {
                    weddingId,
                    guestName,
                    amount: parseFloat(amount),
                    message: message || ''
                }
            });

            res.status(201).json({ success: true, data: newGift });
        } catch (error: any) {
            console.error('Gift create error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }

    async getGiftsByWedding(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            const gifts = await prisma.gift.findMany({
                where: { weddingId },
                orderBy: { createdAt: 'desc' }
            });

            res.json({ success: true, data: gifts });
        } catch (error: any) {
            console.error('Gift fetch error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }
}

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

            const newGift = {
                id: randomUUID(),
                weddingId,
                guestName,
                amount,
                message: message || '',
                timestamp: new Date().toISOString()
            };

            await db.insert('gifts', newGift);

            res.status(201).json({ success: true, data: newGift });
        } catch (error: any) {
            console.error('Gift create error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }

    async getGiftsByWedding(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            // JSONDb findOne implementation in db.ts is actually 'find' based on predicate? 
            // Wait, db.ts only has findOne and insert and update. 
            // I need to add a 'filter' method to db.ts or just read all and filter here for prototype.
            // Let's rely on db.data access directly since it exposes it.

            await db.load();
            const gifts = (db.data.gifts || []).filter((g: any) => g.weddingId === weddingId);

            res.json({ success: true, data: gifts });
        } catch (error: any) {
            console.error('Gift fetch error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }
}

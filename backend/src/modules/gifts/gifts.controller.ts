import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { GiftsService } from './gifts.service';

const giftsService = new GiftsService();

export class GiftsController {
    async sendGift(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            const gift = await giftsService.sendGift(weddingId, req.body);
            res.status(201).json({ success: true, data: gift });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async listByWedding(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const { weddingId } = req.params;
            const result = await giftsService.getByWedding(weddingId, req.user.userId);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { WeddingsService } from './weddings.service.js';

const weddingsService = new WeddingsService();

export class WeddingsController {
    async create(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const wedding = await weddingsService.create(req.user.userId, req.body);
            res.status(201).json({ success: true, data: wedding });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getBySlug(req: AuthRequest, res: Response) {
        try {
            const wedding = await weddingsService.getBySlug(req.params.slug);
            if (!wedding) return res.status(404).json({ message: 'To\'y topilmadi' });
            res.status(200).json({ success: true, data: wedding });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getMyWeddings(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            const weddings = await weddingsService.getByUser(req.user.userId);
            res.status(200).json({ success: true, data: weddings });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

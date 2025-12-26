import { Request, Response } from 'express';
import { MediaService } from './media.service';

const mediaService = new MediaService();

export class MediaController {
    async upload(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            const media = await mediaService.upload(weddingId, req.body);
            res.status(201).json({ success: true, data: media });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getByWedding(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            const media = await mediaService.getByWedding(weddingId);
            res.status(200).json({ success: true, data: media });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

import { Request, Response } from 'express';
import prisma from '../../config/db';

export class MediaController {
    async uploadMedia(req: Request, res: Response) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: "Fayl yuklanmadi" });
                return;
            }

            const { weddingId } = req.body;

            if (!weddingId) {
                res.status(400).json({ success: false, message: "Wedding ID yetishmayapti" });
                return;
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            const type = req.file.mimetype.startsWith('image/') ? 'IMAGE' : 'VIDEO';

            const newMedia = await prisma.media.create({
                data: {
                    weddingId,
                    fileUrl,
                    type,
                    uploadedByGuest: true
                }
            });

            res.status(201).json({ success: true, data: newMedia });
        } catch (error: any) {
            console.error('Media upload error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }

    async getMediaByWedding(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            const media = await prisma.media.findMany({
                where: { weddingId },
                orderBy: { createdAt: 'desc' }
            });
            res.json({ success: true, data: media });
        } catch (error: any) {
            console.error('Media fetch error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }
}

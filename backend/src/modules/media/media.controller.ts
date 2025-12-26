import { Request, Response } from 'express';
import db from '../../config/db';
import { randomUUID } from 'crypto';
import path from 'path';

export class MediaController {
    async uploadMedia(req: Request, res: Response) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: "Fayl yuklanmadi" });
                return;
            }

            const { weddingId } = req.body; // Multer parses body too

            if (!weddingId) {
                res.status(400).json({ success: false, message: "Wedding ID yetishmayapti" });
                return;
            }

            // Construct public URL (Assuming we serve 'uploads' statically)
            // We need to add static file serving in app.ts
            const fileUrl = `/uploads/${req.file.filename}`;

            const newMedia = {
                id: randomUUID(),
                weddingId,
                fileUrl,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                timestamp: new Date().toISOString()
            };

            await db.insert('media', newMedia);

            res.status(201).json({ success: true, data: newMedia });
        } catch (error: any) {
            console.error('Media upload error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }

    async getMediaByWedding(req: Request, res: Response) {
        try {
            const { weddingId } = req.params;
            await db.load();
            const media = (db.data.media || []).filter((m: any) => m.weddingId === weddingId);
            res.json({ success: true, data: media });
        } catch (error: any) {
            console.error('Media fetch error:', error);
            res.status(500).json({ success: false, message: "Server xatosi" });
        }
    }
}

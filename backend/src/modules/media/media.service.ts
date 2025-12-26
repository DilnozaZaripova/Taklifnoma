import db from '../../config/db';
import { randomUUID } from 'crypto';

export class MediaService {
    async upload(weddingId: string, data: any) {
        const { fileUrl, type } = data;
        const id = randomUUID();

        const newMedia = {
            id,
            weddingId,
            fileUrl,
            type,
            uploadedByGuest: true,
            createdAt: new Date().toISOString()
        };

        await db.insert('media', newMedia);
        return newMedia;
    }

    async getByWedding(weddingId: string) {
        await (db as any).load();
        const media = (db as any).data.media
            .filter((m: any) => m.weddingId === weddingId)
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return media;
    }
}

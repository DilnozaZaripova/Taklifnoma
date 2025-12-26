import db from '../../config/db';
import { randomUUID } from 'crypto';

export class WeddingsService {
    async create(userId: string, data: any) {
        const { groomName, brideName, weddingDate, weddingLocation, language, slug } = data;
        const id = randomUUID();

        const newWedding = {
            id,
            userId,
            groomName,
            brideName,
            weddingDate: new Date(weddingDate).toISOString(),
            weddingLocation,
            language,
            slug,
            invitationStyle: 'classic',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await db.insert('weddings', newWedding);
        return newWedding;
    }

    async getBySlug(slug: string) {
        const wedding = await db.findOne('weddings', (w: any) => w.slug === slug);
        if (wedding) {
            // Mock includes for simplicity
            wedding.invitations = [];
            wedding.media = [];
        }
        return wedding;
    }

    async getByUser(userId: string) {
        const weddings = (await (db as any).load(), (db as any).data.weddings.filter((w: any) => w.userId === userId));
        return weddings;
    }

    async update(id: string, userId: string, data: any) {
        await db.update('weddings', (w: any) => w.id === id && w.userId === userId, data);
    }

    async delete(id: string, userId: string) {
        // Implementation for deletion if needed
    }
}

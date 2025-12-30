import prisma from '../../config/db';
import { randomBytes } from 'crypto';

export class GuestService {
    private generateLinkToken(): string {
        return randomBytes(16).toString('hex');
    }

    async createGuest(data: {
        weddingId: string;
        name: string;
        phone?: string;
        email?: string;
    }) {
        const linkToken = this.generateLinkToken();

        return await prisma.guest.create({
            data: {
                weddingId: data.weddingId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                linkToken
            }
        });
    }

    async getGuestsByWedding(weddingId: string) {
        return await prisma.guest.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getGuestByToken(linkToken: string) {
        return await prisma.guest.findUnique({
            where: { linkToken }
        });
    }

    async updateGuest(id: string, data: {
        name?: string;
        phone?: string;
        email?: string;
        invitationId?: string;
    }) {
        return await prisma.guest.update({
            where: { id },
            data
        });
    }

    async markAsViewed(linkToken: string) {
        return await prisma.guest.update({
            where: { linkToken },
            data: {
                hasViewed: true,
                viewedAt: new Date()
            }
        });
    }

    async deleteGuest(id: string) {
        return await prisma.guest.delete({
            where: { id }
        });
    }

    async getGuestStats(weddingId: string) {
        const guests = await this.getGuestsByWedding(weddingId);

        return {
            totalGuests: guests.length,
            viewedCount: guests.filter(g => g.hasViewed).length,
            invitationsSent: guests.filter(g => g.invitationId).length
        };
    }
}

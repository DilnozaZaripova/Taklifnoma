import prisma from '../../config/db';

export class RSVPService {
    async createRSVP(data: {
        weddingId: string;
        guestName: string;
        guestPhone?: string;
        guestEmail?: string;
        status: string;
        attendeeCount?: number;
        message?: string;
    }) {
        const rsvp = await prisma.rSVP.create({
            data: {
                weddingId: data.weddingId,
                guestName: data.guestName,
                guestPhone: data.guestPhone,
                guestEmail: data.guestEmail,
                status: data.status,
                attendeeCount: data.attendeeCount || 1,
                message: data.message
            }
        });

        return rsvp;
    }

    async getRSVPsByWedding(weddingId: string) {
        const rsvps = await prisma.rSVP.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' }
        });

        const stats = {
            total: rsvps.length,
            attending: rsvps.filter(r => r.status === 'ATTENDING').length,
            notAttending: rsvps.filter(r => r.status === 'NOT_ATTENDING').length,
            maybe: rsvps.filter(r => r.status === 'MAYBE').length,
            totalGuests: rsvps
                .filter(r => r.status === 'ATTENDING')
                .reduce((sum, r) => sum + r.attendeeCount, 0)
        };

        return { rsvps, stats };
    }

    async getRSVPById(id: string) {
        return await prisma.rSVP.findUnique({
            where: { id }
        });
    }

    async updateRSVP(id: string, data: {
        status?: string;
        attendeeCount?: number;
        message?: string;
    }) {
        return await prisma.rSVP.update({
            where: { id },
            data
        });
    }

    async deleteRSVP(id: string) {
        return await prisma.rSVP.delete({
            where: { id }
        });
    }
}

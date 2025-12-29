import prisma from '../../config/db';

export class WeddingsService {
    async create(userId: string, data: any) {
        const { groomName, brideName, weddingDate, weddingLocation, language, slug } = data;

        const newWedding = await prisma.wedding.create({
            data: {
                userId,
                groomName,
                brideName,
                weddingDate: new Date(weddingDate),
                weddingLocation,
                language,
                slug,
                invitationStyle: 'classic'
            }
        });
        return newWedding;
    }

    async getBySlug(slug: string) {
        const wedding = await prisma.wedding.findUnique({
            where: { slug },
            include: {
                invitations: true,
                media: true
            }
        });
        return wedding;
    }

    async getByUser(userId: string) {
        return prisma.wedding.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, userId: string, data: any) {
        // Need to ensure user owns the wedding or verify externally. 
        // For now, simpler update:
        await prisma.wedding.updateMany({
            where: { id, userId }, // Acts as a security check
            data: { ...data }
        });
    }

    async delete(id: string, userId: string) {
        await prisma.wedding.deleteMany({
            where: { id, userId }
        });
    }
}

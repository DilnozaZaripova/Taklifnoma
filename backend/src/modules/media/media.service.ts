import prisma from '../../config/db';

export class MediaService {
    async upload(weddingId: string, data: any) {
        const { fileUrl, type } = data;

        const newMedia = await prisma.media.create({
            data: {
                weddingId,
                fileUrl,
                type,
                uploadedByGuest: true
            }
        });
        return newMedia;
    }

    async getByWedding(weddingId: string) {
        return prisma.media.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' }
        });
    }
}

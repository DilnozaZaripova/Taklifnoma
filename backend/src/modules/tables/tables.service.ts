import prisma from '../../config/db';

export class TableService {
    async createTable(data: {
        weddingId: string;
        name: string;
        capacity: number;
    }) {
        return await prisma.table.create({
            data: {
                weddingId: data.weddingId,
                name: data.name,
                capacity: data.capacity
            }
        });
    }

    async getTablesByWedding(weddingId: string) {
        return await prisma.table.findMany({
            where: { weddingId },
            include: {
                guests: true
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    async getTableById(id: string) {
        return await prisma.table.findUnique({
            where: { id },
            include: {
                guests: true
            }
        });
    }

    async updateTable(id: string, data: {
        name?: string;
        capacity?: number;
    }) {
        return await prisma.table.update({
            where: { id },
            data
        });
    }

    async deleteTable(id: string) {
        return await prisma.table.delete({
            where: { id }
        });
    }

    async addGuestToTable(data: {
        tableId: string;
        guestName: string;
        guestPhone?: string;
        guestEmail?: string;
    }) {
        return await prisma.tableGuest.create({
            data: {
                tableId: data.tableId,
                guestName: data.guestName,
                guestPhone: data.guestPhone,
                guestEmail: data.guestEmail
            }
        });
    }

    async removeGuestFromTable(guestId: string) {
        return await prisma.tableGuest.delete({
            where: { id: guestId }
        });
    }

    async getTableStats(weddingId: string) {
        const tables = await this.getTablesByWedding(weddingId);

        const totalTables = tables.length;
        const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
        const totalGuests = tables.reduce((sum, t) => sum + t.guests.length, 0);
        const availableSeats = totalCapacity - totalGuests;

        return {
            totalTables,
            totalCapacity,
            totalGuests,
            availableSeats
        };
    }
}

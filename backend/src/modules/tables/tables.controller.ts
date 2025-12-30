import { Request, Response } from 'express';
import { TableService } from './tables.service';
import { AuthRequest } from '../../middlewares/auth';

const tableService = new TableService();

export class TableController {
    async createTable(req: AuthRequest, res: Response) {
        try {
            const { weddingId, name, capacity } = req.body;

            if (!weddingId || !name || !capacity) {
                res.status(400).json({
                    success: false,
                    message: 'Wedding ID, name, and capacity are required'
                });
                return;
            }

            const table = await tableService.createTable({
                weddingId,
                name,
                capacity
            });

            res.status(201).json({
                success: true,
                data: table
            });
        } catch (error: any) {
            console.error('Create table error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getTablesByWedding(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            const tables = await tableService.getTablesByWedding(weddingId);

            res.status(200).json({
                success: true,
                data: tables
            });
        } catch (error: any) {
            console.error('Get tables error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async updateTable(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, capacity } = req.body;

            const updated = await tableService.updateTable(id, {
                name,
                capacity
            });

            res.status(200).json({
                success: true,
                data: updated
            });
        } catch (error: any) {
            console.error('Update table error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async deleteTable(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await tableService.deleteTable(id);

            res.status(200).json({
                success: true,
                message: 'Stol o\'chirildi'
            });
        } catch (error: any) {
            console.error('Delete table error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async addGuest(req: AuthRequest, res: Response) {
        try {
            const { tableId, guestName, guestPhone, guestEmail } = req.body;

            if (!tableId || !guestName) {
                res.status(400).json({
                    success: false,
                    message: 'Table ID and guest name are required'
                });
                return;
            }

            const guest = await tableService.addGuestToTable({
                tableId,
                guestName,
                guestPhone,
                guestEmail
            });

            res.status(201).json({
                success: true,
                data: guest
            });
        } catch (error: any) {
            console.error('Add guest error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async removeGuest(req: AuthRequest, res: Response) {
        try {
            const { guestId } = req.params;

            await tableService.removeGuestFromTable(guestId);

            res.status(200).json({
                success: true,
                message: 'Mehmon o\'chirildi'
            });
        } catch (error: any) {
            console.error('Remove guest error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getStats(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            const stats = await tableService.getTableStats(weddingId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            console.error('Get stats error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

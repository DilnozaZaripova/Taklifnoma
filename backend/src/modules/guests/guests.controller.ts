import { Request, Response } from 'express';
import { GuestService } from './guests.service';
import { AuthRequest } from '../../middlewares/auth';

const guestService = new GuestService();

export class GuestController {
    async createGuest(req: AuthRequest, res: Response) {
        try {
            const { weddingId, name, phone, email } = req.body;

            if (!weddingId || !name) {
                res.status(400).json({
                    success: false,
                    message: 'Wedding ID and name are required'
                });
                return;
            }

            const guest = await guestService.createGuest({
                weddingId,
                name,
                phone,
                email
            });

            res.status(201).json({
                success: true,
                data: guest
            });
        } catch (error: any) {
            console.error('Create guest error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getGuestsByWedding(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            const guests = await guestService.getGuestsByWedding(weddingId);

            res.status(200).json({
                success: true,
                data: guests
            });
        } catch (error: any) {
            console.error('Get guests error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    // Public endpoint - accessed via guest token
    async getGuestByToken(req: Request, res: Response) {
        try {
            const { token } = req.params;

            const guest = await guestService.getGuestByToken(token);

            if (!guest) {
                res.status(404).json({
                    success: false,
                    message: 'Mehmon topilmadi'
                });
                return;
            }

            // Mark as viewed
            await guestService.markAsViewed(token);

            res.status(200).json({
                success: true,
                data: guest
            });
        } catch (error: any) {
            console.error('Get guest by token error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async updateGuest(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, phone, email, invitationId } = req.body;

            const updated = await guestService.updateGuest(id, {
                name,
                phone,
                email,
                invitationId
            });

            res.status(200).json({
                success: true,
                data: updated
            });
        } catch (error: any) {
            console.error('Update guest error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async deleteGuest(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await guestService.deleteGuest(id);

            res.status(200).json({
                success: true,
                message: 'Mehmon o\'chirildi'
            });
        } catch (error: any) {
            console.error('Delete guest error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getStats(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            const stats = await guestService.getGuestStats(weddingId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            console.error('Get guest stats error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

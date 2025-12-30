import { Request, Response } from 'express';
import { RSVPService } from './rsvp.service';
import { AuthRequest } from '../../middlewares/auth';

const rsvpService = new RSVPService();

export class RSVPController {
    // Public endpoint - anyone can RSVP
    async createRSVP(req: Request, res: Response) {
        try {
            const { weddingId, guestName, guestPhone, guestEmail, status, attendeeCount, message } = req.body;

            if (!weddingId || !guestName || !status) {
                res.status(400).json({
                    success: false,
                    message: 'Wedding ID, guest name, and status are required'
                });
                return;
            }

            const validStatuses = ['ATTENDING', 'NOT_ATTENDING', 'MAYBE'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be ATTENDING, NOT_ATTENDING, or MAYBE'
                });
                return;
            }

            const rsvp = await rsvpService.createRSVP({
                weddingId,
                guestName,
                guestPhone,
                guestEmail,
                status,
                attendeeCount,
                message
            });

            res.status(201).json({
                success: true,
                data: rsvp,
                message: 'RSVP muvaffaqiyatli saqlandi!'
            });
        } catch (error: any) {
            console.error('Create RSVP error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    // Protected endpoint - wedding owner can view RSVPs
    async getRSVPsByWedding(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            if (!weddingId) {
                res.status(400).json({ success: false, message: 'Wedding ID required' });
                return;
            }

            const result = await rsvpService.getRSVPsByWedding(weddingId);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Get RSVPs error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async updateRSVP(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status, attendeeCount, message } = req.body;

            const updated = await rsvpService.updateRSVP(id, {
                status,
                attendeeCount,
                message
            });

            res.status(200).json({
                success: true,
                data: updated
            });
        } catch (error: any) {
            console.error('Update RSVP error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async deleteRSVP(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await rsvpService.deleteRSVP(id);

            res.status(200).json({
                success: true,
                message: 'RSVP o\'chirildi'
            });
        } catch (error: any) {
            console.error('Delete RSVP error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

import { Request, Response } from 'express';
import prisma from '../../config/db';
import { AuthRequest } from '../../middlewares/auth';

export class UserController {
    async getStats(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            // Get user's weddings
            const weddings = await prisma.wedding.findMany({
                where: { userId },
                include: {
                    invitations: true,
                    gifts: true
                }
            });

            // Calculate stats across all weddings
            let acceptedRSVPs = 0;
            let totalGiftAmount = 0;

            weddings.forEach(wedding => {
                acceptedRSVPs += wedding.invitations.filter(inv => inv.status === 'ACCEPTED').length;
                totalGiftAmount += wedding.gifts.reduce((sum, gift) => sum + gift.amount, 0);
            });

            res.status(200).json({
                success: true,
                data: {
                    weddingCount: weddings.length,
                    acceptedRSVPs,
                    totalGiftAmount,
                    totalInvitations: weddings.reduce((sum, w) => sum + w.invitations.length, 0)
                }
            });
        } catch (error: any) {
            console.error('Stats error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

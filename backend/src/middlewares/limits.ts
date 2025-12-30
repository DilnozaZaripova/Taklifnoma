import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../config/db';
import { getTierLimits, SubscriptionTier } from '../config/tiers';

export async function checkWeddingLimit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { weddings: true }
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const limits = getTierLimits(user.subscriptionTier as SubscriptionTier);

        if (user.weddings.length >= limits.maxWeddings) {
            res.status(403).json({
                success: false,
                message: `To'ylar soni limiti tugadi. ${user.subscriptionTier} tarif: ${limits.maxWeddings} ta to'y.`,
                upgrade: true,
                currentTier: user.subscriptionTier
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Wedding limit check error:', error);
        res.status(500).json({ success: false, message: 'Server xatosi' });
    }
}

export async function checkGuestLimit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        const { weddingId } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const guestCount = await prisma.guest.count({
            where: { weddingId }
        });

        const limits = getTierLimits(user.subscriptionTier as SubscriptionTier);

        if (guestCount >= limits.maxGuestsPerWedding) {
            res.status(403).json({
                success: false,
                message: `Mehmonlar soni limiti tugadi. ${user.subscriptionTier} tarif: ${limits.maxGuestsPerWedding} ta mehmon.`,
                upgrade: true,
                currentTier: user.subscriptionTier
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Guest limit check error:', error);
        res.status(500).json({ success: false, message: 'Server xatosi' });
    }
}

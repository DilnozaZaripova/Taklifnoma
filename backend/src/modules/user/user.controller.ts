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

    async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    subscriptionTier: true
                }
            });

            if (!user) {
                res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
                return;
            }

            res.status(200).json({ success: true, data: user });
        } catch (error: any) {
            console.error('Profile error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const { fullName, email, phone } = req.body;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const updated = await prisma.user.update({
                where: { id: userId },
                data: {
                    fullName: fullName || undefined,
                    email: email || undefined,
                    phone: phone || undefined
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true
                }
            });

            res.status(200).json({ success: true, data: updated });
        } catch (error: any) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async changePassword(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const { currentPassword, newPassword } = req.body;

            if (!userId || !currentPassword || !newPassword) {
                res.status(400).json({ success: false, message: 'Barcha maydonlar talab qilinadi' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user || !user.password) {
                res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
                return;
            }

            // Verify current password
            const bcrypt = require('bcrypt');
            const isValid = await bcrypt.compare(currentPassword, user.password);

            if (!isValid) {
                res.status(400).json({ success: false, message: 'Joriy parol noto\'g\'ri' });
                return;
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            res.status(200).json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' });
        } catch (error: any) {
            console.error('Password change error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

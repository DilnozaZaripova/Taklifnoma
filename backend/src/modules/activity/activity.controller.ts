import { Request, Response } from 'express';
import { ActivityLogService } from './activity.service';
import { AuthRequest } from '../../middlewares/auth';

const activityService = new ActivityLogService();

export class ActivityController {
    async getActivities(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const activities = await activityService.getActivitiesByUser(userId);

            res.status(200).json({
                success: true,
                data: activities
            });
        } catch (error: any) {
            console.error('Get activities error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }

    async getActivitiesByWedding(req: AuthRequest, res: Response) {
        try {
            const { weddingId } = req.params;

            if (!weddingId) {
                res.status(400).json({ success: false, message: 'Wedding ID required' });
                return;
            }

            const activities = await activityService.getActivitiesByWedding(weddingId);

            res.status(200).json({
                success: true,
                data: activities
            });
        } catch (error: any) {
            console.error('Get wedding activities error:', error);
            res.status(500).json({ success: false, message: 'Server xatosi' });
        }
    }
}

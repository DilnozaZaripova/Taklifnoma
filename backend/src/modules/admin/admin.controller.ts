import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { AdminService } from './admin.service';

const adminService = new AdminService();

export class AdminController {
    async getStats(req: AuthRequest, res: Response) {
        try {
            const stats = await adminService.getStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async listUsers(req: AuthRequest, res: Response) {
        try {
            const users = await adminService.listUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

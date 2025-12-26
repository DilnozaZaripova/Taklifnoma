import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { identifier, password } = req.body;
            const result = await authService.login(identifier, password);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(401).json({ success: false, message: error.message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
}

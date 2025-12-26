import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Avtorizatsiya xatoligi' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyAccessToken(token) as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token yaroqsiz yoki muddati o\'tgan' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Ruxsat berilmagan' });
        }
        next();
    };
};

import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, config.JWT_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET) as { userId: string, role: string };
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: string };
};

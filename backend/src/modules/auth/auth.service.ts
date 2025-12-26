import bcrypt from 'bcrypt';
import db from '../../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { randomUUID } from 'crypto';

export class AuthService {
    async register(data: any) {
        const { fullName, phone, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = randomUUID();

        const newUser = {
            id,
            fullName,
            phone,
            email,
            password: hashedPassword,
            role: 'USER',
            refreshTokens: null,
            createdAt: new Date().toISOString()
        };

        await db.insert('users', newUser);
        return { id, fullName, phone, email };
    }

    async login(identifier: string, password: string) {
        const user = await db.findOne('users', (u: any) =>
            u.email === identifier || u.phone === identifier
        );

        if (!user || !user.password) {
            throw new Error('Foydalanuvchi topilmadi');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Parol noto\'g\'ri');
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        await db.update('users', (u: any) => u.id === user.id, { refreshTokens: refreshToken });

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        const decoded = verifyRefreshToken(token);
        const user = await db.findOne('users', (u: any) => u.id === decoded.userId);

        if (!user || user.refreshTokens !== token) {
            throw new Error('Refresh token yaroqsiz');
        }

        const accessToken = generateAccessToken(user.id, user.role);
        return { accessToken };
    }
}

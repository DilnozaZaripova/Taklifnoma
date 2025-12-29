import bcrypt from 'bcrypt';
import prisma from '../../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export class AuthService {
    async register(data: any) {
        const { fullName, phone, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fullName,
                phone,
                email,
                password: hashedPassword,
                role: 'USER',
                refreshTokens: null
            }
        });

        return { id: newUser.id, fullName: newUser.fullName, phone: newUser.phone, email: newUser.email };
    }

    async login(identifier: string, password: string) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user || !user.password) {
            throw new Error('Foydalanuvchi topilmadi');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Parol noto\'g\'ri');
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshTokens: refreshToken }
        });

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        } catch (e) {
            throw new Error('Refresh token yaroqsiz');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.refreshTokens !== token) {
            throw new Error('Refresh token yaroqsiz');
        }

        const accessToken = generateAccessToken(user.id, user.role);
        return { accessToken };
    }
}

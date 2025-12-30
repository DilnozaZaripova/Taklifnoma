import bcrypt from 'bcrypt';
import prisma from '../../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { emailService } from '../../utils/email';

export class AuthService {
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async register(data: any) {
        const { fullName, phone, email, password } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            throw new Error('Bu email yoki telefon raqam allaqachon ro\'yxatdan o\'tgan');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = this.generateVerificationCode();

        const newUser = await prisma.user.create({
            data: {
                fullName,
                phone,
                email,
                password: hashedPassword,
                role: 'USER',
                refreshTokens: null,
                isVerified: false,
                verificationCode
            }
        });

        // Send verification email
        if (email) {
            await emailService.sendVerificationCode(email, verificationCode, fullName || 'Foydalanuvchi');
        }

        return {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            requireVerification: true
        };
    }

    async verifyEmail(email: string, code: string) {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            throw new Error('Foydalanuvchi topilmadi');
        }

        if (user.isVerified) {
            throw new Error('Email allaqachon tasdiqlangan');
        }

        if (user.verificationCode !== code) {
            throw new Error('Tasdiqlash kodi noto\'g\'ri');
        }

        // Mark as verified and clear the code
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null
            }
        });

        // Generate tokens for auto-login
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshTokens: refreshToken }
        });

        return {
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email
            },
            accessToken,
            refreshToken
        };
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

        // Check if email is verified
        if (!user.isVerified) {
            throw new Error('Iltimos, avval emailingizni tasdiqlang');
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

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone, password } = body;

        // Validation
        if ((!email && !phone) || !password) {
            return NextResponse.json(
                { success: false, message: 'Email/telefon va parol talab qilinadi' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email || '' },
                    { phone: phone || '' }
                ]
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Foydalanuvchi topilmadi' },
                { status: 404 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password || '');

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Parol noto\'g\'ri' },
                { status: 401 }
            );
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            message: 'Muvaffaqiyatli kirdingiz',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Server xatosi: ' + error.message },
            { status: 500 }
        );
    }
}

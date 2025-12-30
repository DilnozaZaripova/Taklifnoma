import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, email, phone, password } = body;

        // Validation
        if (!email || !password || !fullName || !phone) {
            return NextResponse.json(
                { success: false, message: 'Barcha maydonlar (Ism, Email, Telefon, Parol) to\'ldirilishi shart' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Bu email yoki telefon allaqachon ro\'yxatdan o\'tgan' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await (prisma.user as any).create({
            data: {
                fullName,
                email,
                phone,
                password: hashedPassword,
                role: 'USER',
                verificationCode,
                isVerified: false
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Foydalanuvchi muvaffaqiyatli yaratildi. Emailni tasdiqlang.',
            data: { ...user, requireVerification: true }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'Server xatosi: ' + error.message },
            { status: 500 }
        );
    }
}

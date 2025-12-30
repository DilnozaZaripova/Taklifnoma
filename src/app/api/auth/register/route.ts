import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, email, phone, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email va parol talab qilinadi' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone || '' }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Bu email yoki telefon allaqachon ro\'yxatdan o\'tgan' } as any,
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await (prisma.user as any).create({
            data: {
                fullName: fullName || 'Foydalanuvchi',
                email: email,
                phone: phone || '',
                password: hashedPassword,
                verificationCode
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Foydalanuvchi yaratildi. Emailni tasdiqlang.',
            data: { ...user, requireVerification: true }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'Server xatosi' },
            { status: 500 }
        );
    }
}

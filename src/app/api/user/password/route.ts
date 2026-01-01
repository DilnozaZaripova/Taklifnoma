import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'Barcha maydonlar to\'ldirilishi shart' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ success: false, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Foydalanuvchi topilmadi' }, { status: 404 });
        }

        // Check provider
        if (user.provider === 'google' && !user.password) {
            return NextResponse.json({ success: false, message: 'Google orqali kirgan foydalanuvchilar parolni o\'zgartira olmaydi' }, { status: 400 });
        }

        // Validate current password
        if (user.password) {
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ success: false, message: 'Joriy parol noto\'g\'ri' }, { status: 400 });
            }
        } else {
            // If user has no password (migrated?), allow setting one? 
            // Ideally we force them to set one via reset flow, but here we expect currentPassword behavior.
            return NextResponse.json({ success: false, message: 'Parol o\'rnatilmagan' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            success: true,
            message: 'Parol muvaffaqiyatli yangilandi'
        });

    } catch (error: any) {
        console.error('Password Update Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

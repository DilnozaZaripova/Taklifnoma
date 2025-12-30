import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, serverError } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) return badRequest('Email talab qilinadi');

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return badRequest('Foydalanuvchi topilmadi');

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.user.update({
            where: { email },
            data: {
                passwordResetCode: code,
                passwordResetExpiry: expiry
            }
        });

        // In a real app, send email here. For now, we return it for testing or just success.
        console.log(`Password reset code for ${email}: ${code}`);

        return NextResponse.json({
            success: true,
            message: 'Parolni tiklash kodi yuborildi'
        });

    } catch (error) {
        return serverError(error);
    }
}

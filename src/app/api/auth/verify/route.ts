import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { badRequest, serverError } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) return badRequest('Email va kod talab qilinadi');

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.verificationCode !== code) {
            return badRequest('Kod noto\'g\'ri');
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationCode: null
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Email tasdiqlandi'
        });
    } catch (error) {
        return serverError(error);
    }
}

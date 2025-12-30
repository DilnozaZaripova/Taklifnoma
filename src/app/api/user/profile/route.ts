import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorized, serverError, badRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) return unauthorized();

        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                onboardingCompleted: true,
                subscriptionTier: true,
                createdAt: true
            }
        });

        if (!user) return badRequest('Foydalanuvchi topilmadi');

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error) {
        return serverError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) return unauthorized();

        const body = await request.json();
        const { fullName, email, phone } = body;

        const updatedUser = await prisma.user.update({
            where: { id: auth.userId },
            data: {
                fullName,
                email,
                phone
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Profil yangilandi',
            data: updatedUser
        });
    } catch (error) {
        return serverError(error);
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                name: true,
                email: true,
                phone: true,
                provider: true,
                // Do not select password
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error: any) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone } = body;

        if (!name) {
            return NextResponse.json({ success: false, message: 'Ism kiritilishi shart' }, { status: 400 });
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                phone
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Profil yangilandi'
        });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

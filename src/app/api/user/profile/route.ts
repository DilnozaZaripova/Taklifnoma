import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                fullName: true,
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
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, email, phone } = body;

        // Validation
        if (!fullName) {
            return NextResponse.json({ success: false, message: 'Ism kiritilishi shart' }, { status: 400 });
        }

        // Prevent email change if provider is google (optional, or just allow it if verified)
        // User requested read-only email for Google, but handled in frontend. Backend should probably enforce it or allow if careful.
        // For now, let's update simple fields.

        await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                fullName,
                phone
                // Email updates might require re-verification, skipping for this MVP step unless requested.
                // Keeping email update logic simple or disabled for safety if needed. 
                // Let's assume email is immutable via this route for now to prevent lockout, or update if provided.
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

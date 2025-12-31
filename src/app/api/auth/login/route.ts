import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateTokens } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json({ success: false, message: 'Login va parol kiritilishi shart' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user || !user.password) {
            return NextResponse.json({ success: false, message: 'Login yoki parol noto\'g\'ri' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: 'Login yoki parol noto\'g\'ri' }, { status: 401 });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Update refresh token in DB if needed (optional based on schema)
        // Schema has `refreshTokens String?`
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshTokens: refreshToken } // Storing single token for now (simple rotation)
        });

        return NextResponse.json({
            success: true,
            message: 'Muvaffaqiyatli kirildi',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server xatosi: ' + error.message }, { status: 500 });
    }
}

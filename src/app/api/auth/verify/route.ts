import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ success: false, message: 'Email va kod kiritilishi shart' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Foydalanuvchi topilmadi' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ success: true, message: 'Email allaqachon tasdiqlangan' });
        }

        if (!user.verificationCode || !user.verificationExpiry) {
            return NextResponse.json({ success: false, message: 'Tasdiqlash kodi mavjud emas. Qayta yuboring.' }, { status: 400 });
        }

        if (user.verificationCode !== code) {
            return NextResponse.json({ success: false, message: 'Noto\'g\'ri kod' }, { status: 400 });
        }

        if (new Date() > user.verificationExpiry) {
            return NextResponse.json({ success: false, message: 'Kod muddati tugagan. Yangi kod so\'rang.' }, { status: 400 });
        }

        // Verify user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationCode: null,
                verificationExpiry: null
            }
        });

        return NextResponse.json({ success: true, message: 'Email muvaffaqiyatli tasdiqlandi' });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server xatosi: ' + error.message }, { status: 500 });
    }
}

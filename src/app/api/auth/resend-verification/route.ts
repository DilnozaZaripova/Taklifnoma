import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email kiritilishi shart' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Foydalanuvchi topilmadi' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ success: false, message: 'Email allaqachon tasdiqlangan' }, { status: 400 });
        }

        // Rate limit check: Don't send if previous code was generated less than 1 min ago
        // Using verificationExpiry - 15 mins to estimate creation time? 
        // Or just allow overwrite. For MVP, overwrite is fine but let's check config.
        const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

        if (!smtpConfigured) {
            return NextResponse.json({ success: false, message: 'Email xizmati sozlanmagan (Auto-verify uchun qayta ro\'yxatdan o\'ting)' }, { status: 400 });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await sendEmail({
            to: email,
            subject: 'Taklifnoma - Yangi tasdiqlash kodi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4A90E2;">Yangi Kod</h2>
                    <p>Siz yangi tasdiqlash kodi so'radingiz:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
                            ${verificationCode}
                        </div>
                    <p>Kod 15 daqiqa davomida amal qiladi.</p>
                </div>
            `
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationCode,
                verificationExpiry
            }
        });

        return NextResponse.json({ success: true, message: 'Yangi kod yuborildi' });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server xatosi: ' + error.message }, { status: 500 });
    }
}

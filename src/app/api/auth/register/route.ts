import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, email, phone, password } = body;

        // Validation
        if (!email || !password || !fullName || !phone) {
            return NextResponse.json(
                { success: false, message: 'Barcha maydonlar (Ism, Email, Telefon, Parol) to\'ldirilishi shart' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Bu email yoki telefon allaqachon ro\'yxatdan o\'tgan' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

        // SMTP Check
        const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;
        const shouldVerify = !!smtpConfigured;

        let emailSent = false;
        if (shouldVerify) {
            emailSent = await sendEmail({
                to: email,
                subject: 'Taklifnoma - Emailni tasdiqlash',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4A90E2;">Xush kelibsiz!</h2>
                        <p>Hurmatli ${fullName},</p>
                        <p>Taklifnoma platformasidan ro'yxatdan o'tganingiz uchun tashakkur. Hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
                            ${verificationCode}
                        </div>
                        <p>Kod 15 daqiqa davomida amal qiladi.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #888;">Agar siz bu so'rovni yubormagan bo'lsangiz, iltimos e'tiborsiz qoldiring.</p>
                    </div>
                `
            });

            if (!emailSent) {
                return NextResponse.json(
                    { success: false, message: 'Email yuborishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.' },
                    { status: 500 }
                );
            }
        }

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                phone,
                password: hashedPassword,
                role: 'USER',
                verificationCode: shouldVerify ? verificationCode : null,
                verificationExpiry: shouldVerify ? verificationExpiry : null,
                emailVerified: !shouldVerify, // Auto-verify if SMTP is missing
                provider: 'credentials'
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                createdAt: true,
                emailVerified: true
            }
        });

        return NextResponse.json({
            success: true,
            message: shouldVerify
                ? 'Foydalanuvchi yaratildi. Emailga kod yuborildi.'
                : 'Foydalanuvchi yaratildi (Email tasdiqlash o\'chirilgan).',
            data: {
                ...user,
                requireVerification: shouldVerify
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'Server xatosi: ' + error.message },
            { status: 500 }
        );
    }
}

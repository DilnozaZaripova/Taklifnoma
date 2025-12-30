import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { badRequest, serverError } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { email, code, newPassword } = await request.json();

        if (!email || !code || !newPassword) {
            return badRequest('Barcha maydonlar to\'ldirilishi shart');
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.passwordResetCode !== code) {
            return badRequest('Kod noto\'g\'ri');
        }

        if (user.passwordResetExpiry && user.passwordResetExpiry < new Date()) {
            return badRequest('Kod vaqti tugagan');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordResetCode: null,
                passwordResetExpiry: null
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Parol muvaffaqiyatli yangilandi'
        });

    } catch (error) {
        return serverError(error);
    }
}

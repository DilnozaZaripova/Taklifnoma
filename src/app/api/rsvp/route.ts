import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serverError, badRequest } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { weddingId, guestName, guestPhone, guestEmail, status, attendeeCount, message } = body;

        if (!weddingId || !guestName || !status) {
            return badRequest('Zaruriy maydonlar to\'ldirilmagan');
        }

        const rsvp = await prisma.rSVP.create({
            data: {
                weddingId,
                guestName,
                guestPhone,
                guestEmail,
                status,
                attendeeCount: attendeeCount || 1,
                message
            }
        });

        return NextResponse.json({
            success: true,
            message: 'RSVP muvaffaqiyatli yuborildi',
            data: rsvp
        }, { status: 201 });

    } catch (error) {
        return serverError(error);
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { weddingId, guestName, amount, message, paymentMethod } = body;

        if (!weddingId || !amount) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Validate wedding exists
        const wedding = await prisma.wedding.findUnique({
            where: { id: weddingId }
        });

        if (!wedding) {
            return NextResponse.json({ success: false, message: 'Wedding not found' }, { status: 404 });
        }

        const gift = await prisma.gift.create({
            data: {
                weddingId,
                guestName: guestName || 'Sirli Mehmon',
                amount: parseFloat(amount),
                message,
                paymentMethod: paymentMethod || 'MANUAL',
                status: 'PENDING' // In real app, would be completed after payment webhook
            }
        });

        return NextResponse.json({
            success: true,
            data: gift,
            message: 'Rahmat! Sizning sovg\'angiz qabul qilindi.'
        });

    } catch (error: any) {
        console.error('Gift API Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

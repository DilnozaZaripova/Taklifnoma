import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth, unauthorized, serverError } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) return unauthorized();

        const weddingsCount = await prisma.wedding.count({
            where: { userId: auth.userId }
        });

        const rsvpsCount = await prisma.rSVP.count({
            where: {
                wedding: {
                    userId: auth.userId
                }
            }
        });

        const giftsCount = await prisma.gift.count({
            where: {
                wedding: {
                    userId: auth.userId
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                weddings: weddingsCount,
                rsvps: rsvpsCount,
                gifts: giftsCount,
                media: 0 // Placeholder
            }
        });
    } catch (error) {
        return serverError(error);
    }
}

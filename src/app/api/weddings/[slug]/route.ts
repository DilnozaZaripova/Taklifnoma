import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serverError, badRequest } from '@/lib/auth-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const wedding = await prisma.wedding.findFirst({
            where: {
                OR: [
                    { id: slug },
                    { slug: slug }
                ]
            }
        });

        if (!wedding) return badRequest('To\'y topilmadi');

        return NextResponse.json({
            success: true,
            data: wedding
        });
    } catch (error) {
        return serverError(error);
    }
}

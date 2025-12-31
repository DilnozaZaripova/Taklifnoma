import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> } // Updated for Next.js 15
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
        }

        const wedding = await prisma.wedding.findUnique({
            where: { slug },
            include: {
                invitations: {
                    where: { status: 'DRAFT' }, // Or PUBLISHED, assuming Draft is main for now
                    orderBy: { updatedAt: 'desc' },
                    take: 1
                },
                media: true
            }
        });

        if (!wedding) {
            return NextResponse.json({ success: false, message: 'Wedding not found' }, { status: 404 });
        }

        // Log guest visit (async)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        await prisma.guestAction.create({
            data: {
                weddingId: wedding.id,
                actionType: 'VISIT',
                ipAddress: ip
            }
        }).catch(err => console.error('Failed to log visit', err));

        // Format response
        const invitation = wedding.invitations[0];

        return NextResponse.json({
            success: true,
            data: {
                id: wedding.id,
                couple: {
                    groom: wedding.groomName,
                    bride: wedding.brideName
                },
                event: {
                    date: wedding.weddingDate,
                    location: wedding.location
                },
                invitation: invitation ? {
                    content: invitation.content,
                    template: invitation.template,
                    meta: invitation.meta
                } : null,
                media: wedding.media.filter(m => !m.uploadedByGuest) // Only official media initially
            }
        });

    } catch (error: any) {
        console.error('Public Wedding API Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

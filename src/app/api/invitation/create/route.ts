import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid token' },
                { status: 401 }
            );
        }

        const userId = decoded.userId;

        // 2. Body Validation
        const body = await request.json();
        const { groom_name, bride_name, wedding_date, wedding_location, language, tone, style } = body;

        if (!groom_name || !bride_name || !wedding_date || !wedding_location) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 3. Logic: Create/Update Wedding & Generate Content
        // Simple logic for "generation" to prevent < error and ensure JSON
        const headline = language === 'uz' ? 'Nikoh To\'yi' : (language === 'ru' ? 'Свадьба' : 'Wedding Ceremony');
        const bismillah = language === 'uz' ? 'Bismillahir Rohmanir Rohim' : '';

        // Mock content generation based on tone
        const invitationBody = `Hurmatli mehmonlar!\nSizni ${groom_name} va ${bride_name}ning nikoh to'yiga lutfan taklif etamiz.\n\nSana: ${wedding_date}\nManzil: ${wedding_location}\n\nSizning tashrifingiz bizga quvonch bag'ishlaydi!`;
        const footerQuote = tone === 'rasmiy' ? 'Hurmat bilan, oilangiz.' : 'Sevgi ila!';

        // DB Operations
        // Check if user already has a wedding, or create new
        let wedding = await prisma.wedding.findFirst({
            where: { userId: userId }
        });

        if (!wedding) {
            wedding = await prisma.wedding.create({
                data: {
                    userId,
                    groomName: groom_name,
                    brideName: bride_name,
                    weddingDate: new Date(wedding_date),
                    location: wedding_location,
                    slug: `${groom_name}-${bride_name}`.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
                }
            });
        } else {
            // Update existing?
            wedding = await prisma.wedding.update({
                where: { id: wedding.id },
                data: {
                    groomName: groom_name,
                    brideName: bride_name,
                    weddingDate: new Date(wedding_date),
                    location: wedding_location
                }
            });
        }

        // Create Invitation Record
        const invitation = await prisma.invitation.create({
            data: {
                weddingId: wedding.id,
                content: invitationBody,
                template: style,
                status: 'DRAFT',
                meta: {
                    headline,
                    bismillah,
                    footer_quote: footerQuote,
                    language,
                    tone
                }
            }
        });

        // 4. Return JSON
        return NextResponse.json({
            success: true,
            data: {
                invitationId: invitation.id,
                headline,
                bismillah,
                invitation_body: invitationBody,
                footer_quote: footerQuote,
                groom_name,
                bride_name,
                wedding_date,
                wedding_location
            }
        });

    } catch (error: any) {
        console.error('Create Invitation Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error: ' + (error.message || 'Unknown error') },
            { status: 500 }
        );
    }
}

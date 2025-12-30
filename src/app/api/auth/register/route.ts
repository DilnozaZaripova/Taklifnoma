import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return NextResponse.json({
        success: false,
        message: 'Registration service temporarily unavailable (Maintenance)',
        maintenance: true
    }, { status: 503 });
}

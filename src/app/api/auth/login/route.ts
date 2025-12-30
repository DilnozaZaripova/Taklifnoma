import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return NextResponse.json({
        success: false,
        message: 'Login service temporarily unavailable (Maintenance)',
        maintenance: true
    }, { status: 503 });
}

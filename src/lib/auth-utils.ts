import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthPayload {
    userId: string;
    email: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function unauthorized() {
    return NextResponse.json(
        { success: false, message: 'Ruxsat etilmagan' },
        { status: 401 }
    );
}

export function badRequest(message: string) {
    return NextResponse.json(
        { success: false, message },
        { status: 400 }
    );
}

export function serverError(error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
        { success: false, message: 'Server xatosi' },
        { status: 500 }
    );
}

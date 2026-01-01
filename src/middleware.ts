import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. Bypass /api/auth routes (Google Login fix)
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // 2. Bypass Public Pages
    const publicPages = [
        '/',
        '/login',
        '/register',
        '/about',
        '/help',
        '/privacy',
        '/invite', // Public invitation views
        '/api/generate', // Public APIs if any
        '/api/health'
    ];

    // Check if path is public (exact match or starts with for nested routes like /invite/...)
    const isPublic = publicPages.some(page =>
        pathname === page || pathname.startsWith(`${page}/`)
    );

    if (isPublic) {
        return NextResponse.next();
    }

    // 3. Protect other routes (Dashboard, etc.)
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    // If trying to access protected route without token
    if (!token && !pathname.startsWith('/_next') && !pathname.includes('.')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
    }

    // 4. If logged in and trying to access login/register, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (handled above manually, but good to exclude from matcher too if possible, 
         *   but user asked for explicit bypass in code)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

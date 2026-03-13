import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protect dashboard and other private routes
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/expenses') || pathname.startsWith('/categories') || pathname.startsWith('/reports'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if logged in and trying to access auth pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/expenses/:path*', '/categories/:path*', '/reports/:path*', '/login', '/register'],
};

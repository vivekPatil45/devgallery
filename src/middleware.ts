import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';
    const isProtectedRoute =
        pathname.startsWith('/create') ||
        pathname.startsWith('/my-projects') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/user');

    // If user is logged in and visits a public auth route → redirect to dashboard
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }

    // If the route is protected and no token is found → redirect to login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', 
        '/login', 
        '/signup', 
        '/create/:path*', 
        '/my-projects/:path*', 
        '/settings/:path*', 
        '/user/:path*'
    ],
};

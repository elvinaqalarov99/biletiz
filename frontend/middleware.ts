import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('refresh_token'); // Get token from cookies
    const url = req.nextUrl.clone();

    // If the token exists, redirect to dashboard
    if (token && req.nextUrl.pathname.includes('/auth')) {
        url.pathname = '/dashboard'; // Redirect to login page
        return NextResponse.redirect(url);
    }

    if (!token && req.nextUrl.pathname.includes('/dashboard')) {
        // If token does not exist, redirect to the login page
        url.pathname = '/auth/login'; // Redirect to login page
        return NextResponse.redirect(url);
    }

    // Proceed to the requested page
    return NextResponse.next();
}
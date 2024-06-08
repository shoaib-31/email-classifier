import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token && req.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (token && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/classify', req.url));
    }

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secret);
            const response = NextResponse.next();

            // Set the user payload in the cookies
            response.cookies.set('user', JSON.stringify(payload), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return response;
        } catch (error) {
            console.error('JWT verification failed:', error);
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/classify'],
};

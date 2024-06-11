import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token = cookies().get('token')?.value;

    if (!token && req.nextUrl.pathname === '/classify') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (token && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/classify', req.url));
    }

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secret);

            const response = NextResponse.next();
            response.cookies.set({
                name: 'user',
                value: JSON.stringify(payload),
                httpOnly: false,
                path: '/',
            });
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

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

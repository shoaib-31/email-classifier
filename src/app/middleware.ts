import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token: any = req.cookies.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const { payload } = await jwtVerify(token, secret);
        req.nextUrl.searchParams.set('user', JSON.stringify(payload));
        return NextResponse.next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/classify'],
};

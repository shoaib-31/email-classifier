import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token: any = req.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const { payload } = await jwtVerify(token.value, secret);

        const response = NextResponse.next();
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

export const config = {
    matcher: ['/classify'],
};

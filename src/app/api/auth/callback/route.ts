import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
);

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.readonly',
];

export async function GET(req: NextRequest) {
    const url = req.url;
    const { searchParams } = new URL(url);
    const code = searchParams.get('code');

    if (code) {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const response = await oauth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo: any = response.data;

        const token = jwt.sign(
            {
                sub: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                accessToken: tokens.access_token,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const responseHeaders = new Headers();
        responseHeaders.append(
            'Set-Cookie',
            cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600,
                path: '/',
            })
        );
        responseHeaders.append(
            'Set-Cookie',
            cookie.serialize('accessToken', tokens.access_token as string, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600,
                path: '/',
            })
        );

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/classify`, {
            headers: responseHeaders,
        });
    }
}

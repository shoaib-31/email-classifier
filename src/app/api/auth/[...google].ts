import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

const SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/gmail.readonly'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.google && req.query.google === 'callback') {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);

        const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo = response.data;

        const token = jwt.sign(
            {
                sub: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600,
            path: '/',
        }));

        res.redirect('/classify');
    } else {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        res.redirect(authUrl);
    }
}

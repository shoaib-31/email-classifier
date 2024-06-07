import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { CustomNextRequest } from '@/app/Inerfaces/request';

export const authenticate = (handler: (req: NextApiRequest, res: NextApiResponse) => void) => {
    return async (req: CustomNextRequest, res: NextApiResponse) => {
        const { token } = cookie.parse(req.headers.cookie || '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            const decoded: jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
            req.user = decoded as { sub: string; email: string; name: string; picture: string; };
            return handler(req, res);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

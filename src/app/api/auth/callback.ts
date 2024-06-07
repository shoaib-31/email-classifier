import { NextApiRequest, NextApiResponse } from 'next';

export default async function callbackHandler(req: NextApiRequest, res: NextApiResponse) {
    res.redirect('/');
}

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const classifyEmail = async (emailContent: string, apiKey: string) => {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
            prompt: `Classify the following email into one of these categories: Important, Promotional, Social, Marketing, Scam.\n\nEmail: ${emailContent}\n\nCategory:`,
            max_tokens: 10,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );

    return response.data.choices[0].text.trim();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { emailContents, apiKey } = req.body;

        if (!emailContents || !Array.isArray(emailContents)) {
            return res.status(400).json({ error: 'Email contents must be an array' });
        }

        try {
            const classifications = await Promise.all(emailContents.map((content: string) => classifyEmail(content, apiKey)));
            return res.status(200).json({ classifications });
        } catch (error: Error | any) {
            console.error('Error classifying emails:', error.response?.data || error.message);
            return res.status(500).json({ error: 'Error classifying emails' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

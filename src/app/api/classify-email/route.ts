import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const classifyEmail = async (emailContent: string, apiKey: string) => {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-16k-0613/completions',
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

export async function POST(req: NextRequest) {
    const { emailContents, apiKey } = await req.json();

    if (!emailContents || !Array.isArray(emailContents)) {
        return NextResponse.json({ error: 'Email contents must be an array' }, { status: 400 });
    }

    try {
        const classifications = await Promise.all(emailContents.map((content: string) => classifyEmail(content, apiKey)));
        return NextResponse.json({ classifications }, { status: 200 });
    } catch (error: Error | any) {
        console.error('Error classifying emails:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Error classifying emails' }, { status: 500 });
    }
}

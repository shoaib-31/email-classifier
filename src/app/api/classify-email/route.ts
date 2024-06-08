import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const { messages, apiKey } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: 'Invalid input. Expecting an array of messages.' },
            { status: 400 }
        );
    }

    const googleAI = new GoogleGenerativeAI(apiKey as string);
    const geminiConfig: any = {
        temperature: 0,
        topP: 1,
        topK: 1,
    };

    const geminiModel = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        geminiConfig,
    });
    const prompt = generatePrompt(messages);
    try {
        const result = await geminiModel.generateContent(prompt);
        const classification = result.response.candidates[0].content.parts[0].text;
        const cleanedResponse = JSON.parse(classification!.replace(/```json|```/g, '').trim());
        return NextResponse.json({ classification: cleanedResponse });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function generatePrompt(messages: string[]) {
    const prompt = messages.map((message, index) => `Message: "${message}"\nCategory:`).join('\n');
    return `Classify the following messages into one of these categories: spam, important, normal, promotion, social and remember to give only stringified array something like ["important","important","spam"] but here ${messages.length} categories such that every email has category.\n\n${prompt}`;
}

import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: params.id as string,
        });

        // Extract HTML content from the message
        const parts = message.data.payload?.parts || [];
        const htmlPart = parts.find(part => part.mimeType === 'text/html');
        const htmlContent = htmlPart?.body?.data
            ? Buffer.from(htmlPart.body.data, 'base64').toString('utf-8')
            : null;

        return NextResponse.json({
            id: message.data.id,
            snippet: message.data.snippet,
            htmlContent,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching email:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

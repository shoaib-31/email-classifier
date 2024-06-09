// @ts-nocheck
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
        if (message.data.payload?.parts === undefined && message.data.payload?.mimeType === 'text/html') {
            const htmlContent = Buffer.from(message.data.payload.body?.data, 'base64').toString('utf-8');
            return NextResponse.json({
                id: message.data.id,
                snippet: message.data.snippet,
                htmlContent,
                fullemail: message.data
            }, { status: 200 });
        }
        // Extract HTML content from the message
        const parts = message.data.payload?.parts || [];
        let htmlContent = null;
        let textContent = null;
        let newParts = null;
        let fileAttachments = [];
        parts.forEach(part => {
            if (part.mimeType === 'text/html' && part.body?.data) {
                htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
            } else if (part.mimeType === 'text/plain' && part.body?.data) {
                textContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
            } else if (part.mimeType === 'multipart/alternative') {
                newParts = part.parts;
            } else if (/^application\//.test(part.mimeType)) {
                fileAttachments.push({
                    mimeType: part.mimeType,
                    filename: part.filename,
                    attachmentId: part.body.attachmentId,
                });
            }
        });
        if (newParts) {
            newParts.forEach(part => {
                if (part.mimeType === 'text/html' && part.body?.data) {
                    htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.mimeType === 'text/plain' && part.body?.data) {
                    textContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
                }
            });
        }
        return NextResponse.json({
            id: message.data.id,
            snippet: message.data.snippet,
            htmlContent,
            textContent,
            fileAttachments,
            fullemail: message.data
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching email:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

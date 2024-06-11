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

        const parts = message.data.payload?.parts || [];
        let htmlContent = null;
        let textContent = null;
        let fileAttachments = [];

        const attachmentMimeTypes = [
            /^application\//,
            /^image\//,
            /^audio\//,
            /^video\//
        ];

        const processParts = (parts) => {
            parts.forEach(part => {
                if (part.mimeType === 'text/html' && part.body?.data) {
                    htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.mimeType === 'text/plain' && part.body?.data) {
                    textContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.mimeType === 'multipart/alternative' || part.mimeType === 'multipart/mixed') {
                    processParts(part.parts || []);
                } else if (attachmentMimeTypes.some(regex => regex.test(part.mimeType))) {
                    fileAttachments.push({
                        mimeType: part.mimeType,
                        filename: part.filename,
                        attachmentId: part.body.attachmentId,
                    });
                }
            });
        };

        processParts(parts);
        return NextResponse.json({
            id: message.data.id,
            snippet: message.data.snippet,
            htmlContent,
            textContent,
            fileAttachments,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching email:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

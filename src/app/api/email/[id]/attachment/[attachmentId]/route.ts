import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string, attachmentId: string } }) {
    const { id, attachmentId } = params;
    const searchParams = req.nextUrl.searchParams;
    const filename = searchParams.get('filename');

    const accessToken = req.cookies.get("accessToken")?.value;

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

        const attachment = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: id,
            id: attachmentId,
        });

        const attachmentData = attachment.data.data;

        if (!attachmentData) {
            return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
        }

        const buffer = Buffer.from(attachmentData, 'base64');


        let actualFilename = filename || attachmentId;

        const response = new NextResponse(buffer, {
            headers: {
                'Content-Disposition': `attachment; filename="${actualFilename}"`,
                'Content-Type': 'application/octet-stream'
            }
        });

        return response;
    } catch (error) {
        console.error('Error fetching attachment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

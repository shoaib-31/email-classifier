import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest, res: NextResponse) {
    const accessToken: any = req.cookies.get('accessToken')?.value;
    const parsedReq = await req.json();
    const emailCount = parsedReq.emailCount;
    console.log("emailcount", emailCount);

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("accessToken", accessToken);


    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const listResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults: emailCount,
        });

        const messageIds = listResponse.data.messages || [];

        const messagePromises = messageIds.map(async (message) => {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            const subject = msg.data.payload.headers.find((header: any) => header.name === 'Subject');
            const from = msg.data.payload.headers.find((header: any) => header.name === 'From');
            let senderName, senderEmail;

            if (from && from.value) {
                const splitValue = from.value.split('<');
                senderName = splitValue[0];
                senderEmail = splitValue.length > 1 ? splitValue[1].split('>')[0] : undefined;
            }

            const messageData = {
                id: message.id,
                body: msg.data.snippet,
                senderEmail,
                senderName,
                subject: subject?.value,
            };
            return messageData;
        });

        const messages = await Promise.all(messagePromises);
        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching emails:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

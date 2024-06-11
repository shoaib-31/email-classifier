import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
    cookies().delete("user");
    cookies().delete("token");
    cookies().delete("accessToken");
    return NextResponse.json({ messsage: "Logged out " }, { status: 200 });
}
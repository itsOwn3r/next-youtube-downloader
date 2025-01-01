import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    const data = await req.json();

    const { url } = data;

    if (!url) {
        return NextResponse.json({ success: false, message: "Youtube URL Must Be Provided!" });
    }

    const videoId = url.split("v=")[1];

    return NextResponse.json({ success: true, videoId });
}
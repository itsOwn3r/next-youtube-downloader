import fetch from 'node-fetch';
import getProxy from "@/lib/getProxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    
    const url =  new URL(req.url);
    
    const imageUrl = url.searchParams.get("url");
    
    if (!imageUrl) {
      return NextResponse.json({ success: false, message: "URL must be provided!" });
    }
    
    
    const proxy = await getProxy();

    const response = await fetch(imageUrl, { agent: proxy ? proxy : undefined });
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 }
    );
  }
}

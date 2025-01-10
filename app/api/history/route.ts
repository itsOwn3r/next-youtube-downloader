import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const findVideos = await db.download.findMany({
      orderBy: {
        date: "desc"
      }
    })


    return NextResponse.json({ success: true, data: findVideos });
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

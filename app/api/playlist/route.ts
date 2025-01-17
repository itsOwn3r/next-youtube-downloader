import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const findPlaylist = await db.playlist.findMany({
      where: {
        isDeleted: false
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ success: true, data: findPlaylist });
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

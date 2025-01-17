import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, params: { id: string }) {
  try {

    const { id } = await params;

    const findPlaylist = await db.playlist.findFirst({
      where:{
        id
      },
      include: {
        PlaylistItem: true
      }
    })

    return NextResponse.json({ success: true, data: findPlaylist?.PlaylistItem });
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

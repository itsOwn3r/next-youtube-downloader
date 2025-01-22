import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, params: { id: string }) {
  try {
    const data = await req.json();

    const { type } = data;

    const { id } = await params;

    if (type === "all") {
      const findPlaylist = await db.playlist.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          PlaylistItem: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return NextResponse.json({ success: true, data: findPlaylist?.PlaylistItem });
      
    } else {

      const findPlaylist = await db.playlist.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          PlaylistItem: {
            where: {
              downloadId: null,
              isDeleted: false
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return NextResponse.json({ success: true, data: findPlaylist?.PlaylistItem,
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
  }
}

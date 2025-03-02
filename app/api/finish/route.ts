import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { videoId, itemId, playlistId } = data;

    if (itemId && playlistId) {

      
    const findVideo = await db.download.findFirst({
      where: {
        videoId
      },
      orderBy: {
        date: "desc"
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setAsDownloaded = await db.download.update({
      where: {
        id: findVideo?.id
      },
      data: {
        isDownloaded: true
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const downloadedPlaylistItem = await db.playlistItem.update({
      where: {
        id: itemId
      },
      data: {
        downloadId: findVideo?.id
      }
    })

    return NextResponse.json({ success: true });      
    } else {
      

    const findVideo = await db.download.findFirst({
      where: {
        videoId
      },
      orderBy: {
        date: "desc"
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setAsDownloaded = await db.download.update({
      where: {
        id: findVideo?.id
      },
      data: {
        isDownloaded: true
      }
    })

    return NextResponse.json({ success: true });    
  }
    


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

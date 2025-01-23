import db from "@/lib/db";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json({ success: false, message: "Invalid request", }, { status: 400 });
    }


    const findVideo = await db.download.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!findVideo) {
      return NextResponse.json({ success: false, message: "Video not found!", }, { status: 400 });
    }

    const fileName = `./public/${findVideo.type === "video" ? "videos" : "audios"}/${findVideo.fileName}.${findVideo.type === "video" ? "mp4" : "mp3"}`;

    unlink(fileName);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteFromHistory = await db.download.delete({
      where: {
        id: findVideo.id
      }
    })


    return NextResponse.json({ success: true });
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

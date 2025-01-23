import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    const findPlaylist = await db.playlist.findFirst({
      where:{
        id,
        isDeleted: false
      }
    })

    const deletePlaylist = await db.playlist.update({
      where: {
        id: findPlaylist?.id
      },
      data: {
        isDeleted: true
      }
    })

    console.log(deletePlaylist);


    return NextResponse.json({ success: true, message: "Playlist deleted!" });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 }
    );
  }
}

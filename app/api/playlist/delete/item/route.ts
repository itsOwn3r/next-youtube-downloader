import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {

    const data = await req.json();

    const { playlistId, id } = data;

console.log(id);
    if (!id || !playlistId) {
      return NextResponse.json({ success: false, message: "You must provide playlistId and playlistItemId!" }, { status: 400 });
    }

    const findPlaylist = await db.playlist.findFirst({
      where:{
        id: playlistId,
        isDeleted: false
      }
    })

    if (!findPlaylist) {
      return NextResponse.json({ success: false, message: "Playlist not found or deleted!" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletePlaylistItem = await db.playlistItem.update({
      where: {
        id: Number(id),
        playlistId
      },
      data: {
        isDeleted: true
      }
    })


    return NextResponse.json({ success: true, message: "Item deleted from playlist!" });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
  }
}

import { Metadata } from "next";

import { columns } from "@/components/PlaylistItem/columns";
import { DataTable } from "@/components/Playlist/data-table";
import Header from "@/components/Home/Header";
import db from "@/lib/db";
import PlaylistItemComponent from "@/components/PlaylistItem/PlaylistItemComponent";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Playlists - YouTube Downloader",
  description: "Keep track of Videos in a playlist.",
};

export async function getPlaylist(id: string) {
  const devUrl = process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
  const response = await fetch(`${devUrl}/api/playlist/${id}`, { method: "POST", body: JSON.stringify({}) });
  const data = await response.json();

  return data.data;
}

export default async function HistoryPage({ params }: { params: { id: string } }) {

  const { id } = await params;

  const playlist = await getPlaylist(id);

  const playlistName = await db.playlist.findUnique({
    where: {
      id: id,
      isDeleted: false
    }
  })

  if (!playlistName) {
    return notFound();
  }

  const proxy = await db.proxy.findUnique({
    where: {
      id: 0,
    },
  });
  

  return (
    <>
      <Header proxy={proxy} />
      <main className="flex flex-1 flex-col">
        <div className="container-wrapper">
          <div className="container py-6">
            <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
              <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
                <div className="flex items-center justify-between space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {playlistName?.title}
                    </h2>
                    <p className="text-muted-foreground">
                      You have {playlistName?.numberOfItems} videos in this playlist!
                    </p>
                  </div>

                  <div>
                    <PlaylistItemComponent id={playlistName?.id || "noID"} titleNonMutate={playlistName?.title || ""} autoUpdateNonMutate={playlistName?.autoUpdate || true} />
                  </div>
                  
                </div>
                <DataTable type="playlistItems" data={playlist} columns={columns} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

import { Metadata } from "next";

import { columns } from "@/components/PlaylistItem/columns";
import Header from "@/components/Home/Header";
import db from "@/lib/db";
import PlaylistItemComponent from "@/components/PlaylistItem/PlaylistItemComponent";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/PlaylistItem/data-table";

export const metadata: Metadata = {
  title: "Playlists - YouTube Downloader",
  description: "Keep track of Videos in a playlist.",
};


const PlaylistPage = async ({params}: {params: Promise<{ id: string }>}) => {
  
  const { id } = await params;


  async function getPlaylist(id: string) {
    const devUrl = process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
    const response = await fetch(`${devUrl}/api/playlist/${id}`, { method: "POST", body: JSON.stringify({}) });
    const data = await response.json();

    return data.data;
  }

  const playlist = await getPlaylist(id);

  const playlistName = await db.playlist.findUnique({
    where: {
      id: id,
      isDeleted: false
    }
  })

  const notDownloaded = await db.playlistItem.count({
    where: {
      playlistId: playlistName?.id,
      downloadId: null
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
  
  
  const quality = await db.quality.findUnique({
    where: {
      id: 0
    }
  })

  return (
    <>
      <Header proxy={proxy} quality={quality?.quality || "480p"} />
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
                    Total videos: {playlistName?.numberOfItems?.toLocaleString("en")} {notDownloaded === 0 ? " - All downloaded ✅" : <span>- Ready to download: <span className="underline underline-offset-8 text-lg text-center inline-flex">{notDownloaded} </span> videos!</span>}
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


export default PlaylistPage;
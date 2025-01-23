"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { playlistItemSchema } from "@/components/data/schema"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { finishDownload } from "@/components/Playlist/DownloadPlaylist"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActionsForPlaylistItems<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const router = useRouter();

  const item = playlistItemSchema.parse(row.original);


  const deleteFromHistory = async (id: number, playlistId: string) => {

    const response = await fetch(`/api/playlist/delete/item`, {
      method: "DELETE",
      body: JSON.stringify({ playlistId, id })
    });

    if (response.ok) {
      toast.success("Item removed from playlist.", { className: "text-xl" });
      router.refresh();
    } else {
      toast.error("Something went wrong!", { className: "text-xl" });
    }

  }


  const downloadHandler = async (type: "audio" | "video") => {
    try {

      const requestForDowload = await fetch(`/api/playlist/download`, {
        method: "POST",
        headers: {
            "Content-Type": "text/event-stream",
          },
          body: JSON.stringify({
            videoId: item.videoId,
            playlistId: item.playlistId,
            id: item.id,
            uploader: item.uploader,
            title: item.title,
            type
          })
    });

    if (!requestForDowload.body) {
        toast.error("Something is wrong with request body!", {
            duration: 4000,
            className: "text-xl"
          });
      return;
    }
    
    const reader = requestForDowload.body.pipeThrough(new TextDecoderStream()).getReader();
      
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value.includes("100.00")) {
        await finishDownload(item.videoId, item.id, item.playlistId);
        if (type === "audio") {

            toast.success("Audio downloaded.", {
                duration: 4000,
                id: "first",
                className: "text-xl"
            });

        } else {
          toast.success("Video downloaded.", {
            duration: 4000,
            id: "first",
            className: "text-xl"
          });
        }

          router.refresh();

      } else {
        toast.loading(`${value}% Downloaded!`, {
          id: "first",
          duration: 4000,
          className: "text-xl"
        });
      }


    }
    } catch (error) {
      toast.error((error as Error).message, { className: "text-xl" });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem className="cursor-pointer" onClick={() => downloadHandler("video")}>Download Video</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => downloadHandler("audio")}>Download Audio</DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`} target="_blank" rel="noopener noreferrer">Show thumbnail</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://www.youtube.com/watch?v=${item.videoId}`} target="_blank" rel="noopener noreferrer">View on YouTube</Link></DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${item.videoId}`)
            toast.success("Link copied to clipboard.", { className: "text-lg" })  
          }
          }>Copy link</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => deleteFromHistory(item.id, item.playlistId)} className="cursor-pointer hover:bg-foreground/20">Remove from playlist</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

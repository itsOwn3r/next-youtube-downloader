"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { labels } from "../data/data"
import { playlistSchema } from "@/components/data/schema"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActionsForPlaylist<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const playlist = playlistSchema.parse(row.original);


  const deletePlaylist = async () => {

    const response = await fetch(`/api/playlist/delete/${playlist.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      toast.success("Playlist deleted. No file will be deleted.", { className: "text-xl" });
      router.refresh();
    } else {
      toast.error("Something went wrong!", { className: "text-xl" });
    }

  }



  const refetchPlaylist = async (id: string) => {

    try {
      setIsLoading(true);

      const response = await fetch(`/api/playlist/refetch/${id}`);

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
            duration: 4000,
            className: "text-xl"
          });
          router.refresh();
      } else {
        toast.error(data.message, {
            duration: 4000,
            className: "text-xl"
          });
      }   
    } catch (error) {
      toast.error((error as Error).message, {
        duration: 4000,
        className: "text-xl"
      });
    } finally {
      setIsLoading(false)
    }
  };

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
        <DropdownMenuItem onClick={() => refetchPlaylist(playlist.id)} disabled={isLoading} className="cursor-pointer flex justify-center items-center bg-lime-800 text-base hover:text-xl hover:bg-green-500">ReFetch</DropdownMenuItem>
        <DropdownMenuItem><Link href={playlist.imageUrl} target="_blank" rel="noopener noreferrer">Show thumbnail</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://www.youtube.com/playlist?list=${playlist.id}`} target="_blank" rel="noopener noreferrer">View on YouTube</Link></DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(`https://www.youtube.com/playlist?list=${playlist.id}`)
            toast.success("Link copied to clipboard.", { className: "text-lg" })  
          }
          }>Copy link</DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoading} onClick={deletePlaylist} className="cursor-pointer">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

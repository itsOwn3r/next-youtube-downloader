"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { historySchema } from "@/components/data/schema"
import { openDirectory } from "@/lib/openDirectory"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const router = useRouter();

  const history = historySchema.parse(row.original);


  const deleteFromHistory = async () => {

    const response = await fetch(`/api/history/delete/${history.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      toast.success("Item removed from histroy.", { className: "text-xl" });
      router.refresh();
    } else {
      toast.error("Something went wrong!", { className: "text-xl" });
    }

  }


  const deleteFromHistoryAndFiles = async () => {

    const response = await fetch(`/api/history/delete/file/${history.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      toast.success("File Deleted!", { className: "text-xl" });
      router.refresh();
    } else {
      toast.error("Something went wrong!", { className: "text-xl" });
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
        {history.isDownloaded && (<><DropdownMenuItem className="cursor-pointer" onClick={() => openDirectory(`${history.type === "audio" ? "audis" : "videos"}`, history.type === "audio" ? `${history.fileName}.mp3` : `${history.fileName}.mp4`)}>Open File</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openDirectory(`${history.type === "audio" ? "audis" : "videos"}`)}>Open Folder</DropdownMenuItem></>)}
        <DropdownMenuItem><Link href={history.thumbnail} target="_blank" rel="noopener noreferrer">Show thumbnail</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://www.youtube.com/watch?v=${history.videoId}`} target="_blank" rel="noopener noreferrer">View on YouTube</Link></DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${history.videoId}`)
            toast.success("Link copied to clipboard.", { className: "text-lg" })  
          }
          }>Copy link</DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteFromHistory} className="cursor-pointer">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        {history.isDownloaded && <DropdownMenuItem onClick={deleteFromHistoryAndFiles} className="cursor-pointer">
          Delete w/ File
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

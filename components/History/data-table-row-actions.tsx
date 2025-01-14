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
import { taskSchema } from "../data/schema"
import { openDirectory } from "../Home/openDirectory"
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

  const task = taskSchema.parse(row.original);


  const deleteFromHistory = async () => {

    const response = await fetch(`/api/history/delete/${task.id}`, {
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

    const response = await fetch(`/api/history/delete/file/${task.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      toast.success("Item removed from histroy.", { className: "text-xl" });
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
        <DropdownMenuItem className="cursor-pointer" onClick={() => openDirectory(`${task.type === "audio" ? "audis" : "videos"}`, task.type === "audio" ? `${task.fileName}.mp3` : `${task.fileName}.mp4`)}>Open File</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => openDirectory(`${task.type === "audio" ? "audis" : "videos"}`)}>Open Folder</DropdownMenuItem>
        <DropdownMenuItem><Link href={task.thumbnail} target="_blank" rel="noopener noreferrer">Show thumbnail</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://www.youtube.com/watch?v=${task.videoId}`} target="_blank" rel="noopener noreferrer">View on YouTube</Link></DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${task.videoId}`)
            toast.success("Link copied to clipboard.", { className: "text-lg" })  
          }
          }>Copy link</DropdownMenuItem>
        <DropdownMenuItem>Add/Remove from playlist</DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* TODO: change of Playlist
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteFromHistory} className="cursor-pointer">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteFromHistoryAndFiles} className="cursor-pointer">
          Delete w/ File
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

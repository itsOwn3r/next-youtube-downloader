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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const task = taskSchema.parse(row.original);

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
        <DropdownMenuItem onClick={() => openDirectory(`${task.type === "audio" ? "audis" : "videos"}`, task.type === "audio" ? `${task.fileName}.mp3` : `${task.fileName}.mp4`)}>Open File</DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDirectory(`${task.type === "audio" ? "audis" : "videos"}`)}>Open Folder</DropdownMenuItem>
        <DropdownMenuItem><Link href={task.thumbnail} target="_blank" rel="noopener noreferrer">Show thumbnail</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={`https://www.youtube.com/watch?v=${task.videoId}`} target="_blank" rel="noopener noreferrer">View on youtube</Link></DropdownMenuItem>
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
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Delete w/ File
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

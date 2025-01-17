"use client"

import { ColumnDef } from "@tanstack/react-table"


import { PlaylistItem } from "@/components/data/schema"
import { DataTableColumnHeader } from "@/components/History/data-table-column-header"
import Link from "next/link"
import Image from "next/image"
import { DataTableRowActionsForPlaylistItems } from "./data-table-row-actions"

export const columns: ColumnDef<PlaylistItem>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex items-center space-x-2">
          <Link className="size-12 relative" href={`https://i.ytimg.com/vi/${row.original.videoId}/hqdefault.jpg`} target="_blank" rel="noreferrer noopener"><Image className="rounded-xl shadow-shine" src={`/api/proxy/image?url=https://i.ytimg.com/vi/${row.original.videoId}/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLA0fCn3GNRJT_l1C_8WpZ7T8Qo-aA`} fill sizes="100" alt={row.original.title} /></Link>
          <Link href={`/playlists/${row.original.id}`} className="h-12 relative flex items-center"><span className="py-1 px-4 text-lg max-w-[500px] truncate hover:scale-105">{row.getValue("title")}</span></Link>
        </div>
      )
    },
  },
  {
    accessorKey: "uploader",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploader" />
    ),
    cell: ({ row }) => {
      const size = row.original.uploader;
      return (
        <div className="flex items-center">
          <span>{size}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "videoLength",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const size = row.original.videoLength;

      return (
        <div className="flex items-center">

          <span>{size}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt");

      return (
        <div className="flex items-center">

          <span>{(new Date(date as Date)).toLocaleTimeString("en") + " " + (new Date(date as Date)).getHours() + ":" + (new Date(date as Date)).getMinutes()}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsForPlaylistItems row={row} />,
  },
]

export const defaultColumn = {
  id: "date",
  isSelected: true,
  sort: 'asc',
}

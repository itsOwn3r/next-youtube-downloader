"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { Playlist } from "@/components/data/schema"
import { DataTableColumnHeader } from "@/components/History/data-table-column-header"
import Link from "next/link"
import Image from "next/image"
import { DataTableRowActionsForPlaylist } from "./data-table-row-actions"

export const columns: ColumnDef<Playlist>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex items-center space-x-2">
          <Link className="size-12 relative" href={row.original.imageUrl} target="_blank" rel="noreferrer noopener"><Image className="rounded-3xl shadow-shine" src={`/api/proxy/image?url=${row.original.imageUrl}?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLA0fCn3GNRJT_l1C_8WpZ7T8Qo-aA`} fill sizes="100" alt={row.original.title} /></Link>
          <Link href={`/playlists/${row.original.id}`} className="h-12 relative"><Badge variant="outline" className="py-1 px-4 text-lg max-w-[500px] truncate hover:scale-105">{row.getValue("title")}</Badge></Link>
        </div>
      )
    },
  },
  {
    accessorKey: "numberOfItems",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Videos" />
    ),
    cell: ({ row }) => {
      const size = row.getValue("numberOfItems");

      return (
        <div className="flex items-center">

          <span>{size as string} videos</span>
        </div>
      )
    }
  },
  {
    accessorKey: "autoUpdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Update method" />
    ),
    cell: ({ row }) => {
      const size = row.original.autoUpdate;
      return (
        <div className="flex items-center">
          <span>{size ? "Auto ✅" : "Manual"}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "updatedAt",
    id: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last updated" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");

      return (
        <div className="flex items-center">

          <span>{new Date((date as Date)).toLocaleDateString("en", { dateStyle: "medium" })} {new Date((date as Date)).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsForPlaylist row={row} />,
  },
]

export const defaultColumn = {
  id: "title",
  isSelected: true,
  sort: 'asc',
}

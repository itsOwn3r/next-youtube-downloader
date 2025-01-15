"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"

import { Task } from "@/components/data/schema"
import { DataTableColumnHeader } from "@/components/History/data-table-column-header"
import { DataTableRowActions } from "@/components/History/data-table-row-actions"
import { CheckIcon, XIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const uploader = row.original.uploader;
      const isDownloaded = row.original.isDownloaded;
      
      return (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{isDownloaded ? <CheckIcon className="size-5 text-green-600" /> : <XIcon className="size-5 text-red-600" />}</TooltipTrigger>
              <TooltipContent>
                <p>{isDownloaded ? "Successful Download" : "Not Downloaded"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link className="size-12 relative" href={row.original.thumbnail} target="_blank" rel="noreferrer noopener"><Image className="rounded-3xl shadow-shine" src={`/api/proxy/image?url=https://i.ytimg.com/vi/${row.original.videoId}/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLA0fCn3GNRJT_l1C_8WpZ7T8Qo-aA`} fill sizes="100" alt={row.original.title} /></Link>

          {uploader && <Badge variant="outline" className="py-1 hover:scale-105">{uploader}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Videos" />
    ),
    cell: ({ row }) => {
      const size = row.getValue("numberOfItems");

      return (
        <div className="flex items-center">

          <span>{size as string}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "date",
    id: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");

      return (
        <div className="flex items-center">

          <span>{(date as Date).toLocaleDateString()}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

export const defaultColumn = {
  id: "date",
  isSelected: true,
  sort: 'asc',
}

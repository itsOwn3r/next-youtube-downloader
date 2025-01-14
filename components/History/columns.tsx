"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { statuses } from "@/components/data/data"
import { Task } from "@/components/data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { CheckIcon, XIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
          <Link className="size-12 relative" href={row.original.thumbnail} target="_blank" rel="noreferrer noopener"><Image className="rounded-3xl shadow-shine" src={`/api/proxy/image?url=https://i.ytimg.com/vi/${row.original.videoId}/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLA0fCn3GNRJT_l1C_8WpZ7T8Qo-aA`} fill alt={row.original.title} /></Link>

          {uploader && <Badge variant="outline" className="py-1 hover:scale-105">{uploader}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("type")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      if (value[0] === "all") {
        return row;
      }
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      const size = row.getValue("size");

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
      const timestamp = row.getValue("date");

      return (
        <div className="flex items-center">

          <span>{new Date((timestamp as number) * 1000).toLocaleDateString("en", { dateStyle: "medium" })} {new Date((timestamp as number) * 1000).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
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

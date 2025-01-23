"use client"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/PlaylistItem/data-table-view-options";

import { X } from "lucide-react";
import DownloadPlaylist from "@/components/Playlist/DownloadPlaylist";




interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setIsDownloadCompleted: React.Dispatch<React.SetStateAction<boolean>>
  setDownloaded: React.Dispatch<React.SetStateAction<string>>
  setVideoId: React.Dispatch<React.SetStateAction<string>>
}

export function DataTableToolbar<TData>({
  table,
  setIsDownloadCompleted,
  setDownloaded,
  setVideoId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter items..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />


    <DownloadPlaylist setIsDownloadCompleted={setIsDownloadCompleted} setDownloaded={setDownloaded} setVideoId={setVideoId} />


    </div>
  )
}

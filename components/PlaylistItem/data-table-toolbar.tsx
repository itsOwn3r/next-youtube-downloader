"use client"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/PlaylistItem/data-table-view-options";

import { X } from "lucide-react";
import DownloadPlaylist from "@/components/Playlist/DownloadPlaylist";




interface DataTableToolbarProps<TData> {
  table: Table<TData>
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  downloaded: string,
  setDownloaded: React.Dispatch<React.SetStateAction<string>>
}

export function DataTableToolbar<TData>({
  table,
  isVisible,
  setIsVisible,
  downloaded,
  setDownloaded
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;


  // console.log(table.setOptions({data: }));

  // const handleDeleteRow = (rowId: string) => {
  //   table.options.data = table.options.data.filter((row: any) => row.id !== rowId);
  //   table.setData(table.options.data);
  // };


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


    <DownloadPlaylist isVisible={isVisible} setIsVisible={setIsVisible} downloaded={downloaded} setDownloaded={setDownloaded} />


    </div>
  )
}

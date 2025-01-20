"use client"

import { Table } from "@tanstack/react-table"
import { Download, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/PlaylistItem/data-table-view-options";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"



interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [quality, setQuality] = useState<"360p" | "480p" | "720p" | "1080p">("480p");


  const switchChangeHandler = (e: "360p" | "480p" | "720p" | "1080p") => {
    console.log(e);
    setQuality(e)
  }

  console.log(quality);

  const downloadAllHandler = async () => {
    const request = await fetch('/api/playlist/download', {
      method: "POST",
      body: JSON.stringify({ type: "All" })
    })

    const data = await request.json();

    console.log(data);
  }

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



      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><div className="flex items-center justify-center rounded-md w-20 h-10 ml-4 bg-green-500 hover:bg-green-300 text-white"><Download className="!h-7 !w-7" /> </div></TooltipTrigger>
                <TooltipContent>
                  <p>Download all videos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you ready to download all of this videos?</DialogTitle>
            <DialogDescription>
              Please don&apos;t close this tab while the app is downloading...
              <br />
              <br />
              <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">360p<Switch checked={quality === "360p"} onClick={() => switchChangeHandler("360p")} /></span>
              <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">480p<Switch checked={quality === "480p"} onClick={() => switchChangeHandler("480p")} /></span>
              <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">720p<Switch checked={quality === "720p"} onClick={() => switchChangeHandler("720p")} /></span>
              <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">1080p<Switch checked={quality === "1080p"} onClick={() => switchChangeHandler("1080p")} /></span>

              <br />
              <span className="flex justify-end gap-x-4 items-center">
                <Button type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button className="flex items-center justify-center rounded-md bg-green-500 hover:bg-green-300 text-white text-lg py-5" onClick={downloadAllHandler}>Ok, Lets Go <span className="animate-pulse">🔥</span></Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

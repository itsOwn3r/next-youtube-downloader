"use client";
import React, { useState } from 'react';
import { Download } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const DownloadPlaylist = () => {
    
  const [isOpen, setIsOpen] = useState(false);
  const [quality, setQuality] = useState<"360p" | "480p" | "720p" | "1080p">("480p");

    const [isLoading, setIsLoading] = useState(false);
  
    const [downloaded, setDownloaded] = useState("");
    const [isDownloadCompleted, setIsDownloadCompleted] = useState(false);

  const params = useParams();

  const { id } = params;


  const switchChangeHandler = (e: "360p" | "480p" | "720p" | "1080p") => {
    console.log(e);
    setQuality(e);
  }

  console.log(quality);

  const downloadAllHandler = async () => {
    try {
        // setIsOpen(false);
        setIsLoading(true);

    const request = await fetch(`/api/playlist/${id}`, {
      method: "POST",
      body: JSON.stringify({})
    })

    const data = await request.json();
    
    console.log(data);

    const itemsToDownload = data.data;

    for (const item of itemsToDownload) {

        const requestForDowload = await fetch(`/api/playlist/download`, {
            method: "POST",
            headers: {
                "Content-Type": "text/event-stream",
              },
            body: JSON.stringify({ videoId: item.videoId, quality, title: item.title, type: item.type, uploader: item.uploader })
        });

        if (!requestForDowload.body) {
            toast.error("Something is wrong with request body!", {
                duration: 4000,
                className: "text-xl"
              });
          return;
        }
        const reader = requestForDowload.body
          .pipeThrough(new TextDecoderStream())
          .getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
    
          if (value.includes("100.00")) {
            finishDownload((item.videoId as string));
            if (item.type === "audio") {
                // setAudioOnly(false);
                setDownloaded("Audio downloaded. Merging files...");
                toast.success("Audio downloaded.", {
                    duration: 4000,
                    className: "text-xl"
                });
            } else {
              setDownloaded("Video downloaded. Downloading audio and merging...");
              toast.success("Video downloaded.", {
                duration: 4000,
                className: "text-xl"
              });          
            }
    
            setTimeout(() => {
              setDownloaded("Download completed!");
              setIsDownloadCompleted(true);
            }, 5000);
          } else {
            if (item.type === "audio") {
              setDownloaded(`Downloading Audio: ${value}% \n \n`);
            } else { 
              setDownloaded(`Downloading video: ${value}% \n \n`);
            }
    
          }
        }

    }        
    } catch (error) {
        toast.error((error as Error).message);
    } finally {
        setIsLoading(false)
    }
  }



  const finishDownload = async (videoId: string) => {

    if (!videoId) {
      toast.error("Failed to mark download as 'Finished' in DB", {
        duration: 4000,
        className: "text-xl"
      });
      return;
    }

    try {

    const response = await fetch("/api/finish", {
      method: "POST",
      body: JSON.stringify({ videoId }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await response.json();

    } catch (error) {
        toast.error((error as Error).message, {
            duration: 4000,
            className: "text-xl"
          });
    }
  };
  
  return (
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
  )
}

export default DownloadPlaylist
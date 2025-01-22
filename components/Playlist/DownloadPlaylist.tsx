"use client";
import React, { useState } from 'react';
import { Download } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';


export const finishDownload = async (videoId: string, itemId: number, playlistId: string) => {

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
    body: JSON.stringify({ videoId, itemId, playlistId }),
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


const DownloadPlaylist = ({ setDownloaded, setVideoId, setIsDownloadCompleted }: { setIsDownloadCompleted: React.Dispatch<React.SetStateAction<boolean>>, setDownloaded: React.Dispatch<React.SetStateAction<string>>, setVideoId: React.Dispatch<React.SetStateAction<string>> }) => {

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();


  const params = useParams();

  const { id } = params;


  const downloadAllHandler = async () => {
    try {
        // setIsOpen(false);
        setIsLoading(true);

    const request = await fetch(`/api/playlist/${id}`, {
      method: "POST",
      body: JSON.stringify({})
    })

    const data = await request.json();

    const itemsToDownload = data.data;

    for (const item of itemsToDownload) {

      setVideoId(item.videoId);

        const requestForDowload = await fetch(`/api/playlist/download`, {
            method: "POST",
            headers: {
                "Content-Type": "text/event-stream",
              },
            body: JSON.stringify({ videoId: item.videoId, title: item.title, type: item.type, uploader: item.uploader })
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
          setIsDownloadCompleted(false);
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
    
          if (value.includes("100.00")) {
            await finishDownload(item.videoId, item.id, item.playlistId);
            if (item.type === "audio") {
                // setAudioOnly(false);
                // setDownloaded("Audio downloaded. Merging files...");
                toast.success("Audio downloaded.", {
                    duration: 4000,
                    className: "text-xl"
                });
            } else {
              // setDownloaded("Video downloaded. Downloading audio and merging...");
              toast.success("Video downloaded.", {
                duration: 4000,
                className: "text-xl"
              });          
            }
    
            // setTimeout(() => {
              // setDownloaded("Download completed!");
              setIsDownloadCompleted(true);
              router.refresh();
            // }, 5000);
          } else {
            if (item.type === "audio") {
              setDownloaded(`${value}%`);
            } else { 
              setDownloaded(`${value}%`);
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




  return (

    <div className='cursor-pointer' onClick={downloadAllHandler}>
      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild><div className={cn("flex items-center justify-center rounded-md w-20 h-10 ml-4 bg-green-500 hover:bg-green-300 text-white", isLoading && "animate-pulse")}><Download className="!h-7 !w-7" /> </div></TooltipTrigger>
            <TooltipContent>
              <p>Download all videos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
  )
}

export default DownloadPlaylist
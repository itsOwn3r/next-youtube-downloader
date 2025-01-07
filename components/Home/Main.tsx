"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ResponseType {
    success: boolean,
    videoId: string,
    title: string,
    thumbnail: string,
    audio: {
        url: string,
        contentLength: string
    },
    video: {
        video360: {
            contentLength: string,
            url: string,
            approxDurationMs: string
        },
        video480: {
            contentLength: string,
            url: string,
            approxDurationMs: string
        },
        video720: {
            contentLength: string,
            url: string,
            approxDurationMs: string
        },
        video1080: {
            contentLength: string,
            url: string,
            approxDurationMs: string
        },
    }
}

const Main = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState<ResponseType | null>(null);
    
    const [downloaded, setDownloaded] = useState("");
    const [isDownloadCompleted, setIsDownloadCompleted] = useState(false);

    const [audioOnly, setAudioOnly] = useState(false);

    console.log(response);

    const bytesToSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const msToTime = (duration: number) => {
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleFetch = async () => {
        if (!url) {
            return;
        }
        try {
            setIsLoading(true);
            setDownloaded("");
            setIsDownloadCompleted(false);
            const response = await fetch("/api/fetch", {
                method: "POST",
                body: JSON.stringify({url})
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setResponse(data);
            } else {
                setResponse(data);
            }
        } catch (error) {
            console.error("Fetch error: ", error);
        } finally {
            setIsLoading(false);
        }
    }


    const downloadVideo = async (url: string, folder?: string) => {
        setIsDownloadCompleted(false);
        setDownloaded("");
        console.log(url);
        console.log(response);
        const requestForDowload = await fetch("/api/download", {
            method: "POST",
            headers: {
                "Content-Type": "text/event-stream",
            },
            body: JSON.stringify({
                url,
                videoId: response?.videoId,
                title: response?.title,
                audio: response?.audio.url,
                thumbnail: response?.thumbnail,
                audioOnly: folder === "audios" ? true : false
            })
        })

        console.log("Before start");

        if (!requestForDowload.body) {
            console.log("Request body is null");
            return;
        }
        const reader = requestForDowload.body.pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        console.log('Received', value);
        if (value.includes("100.00%")) {
            if (audioOnly) {
                setDownloaded("Audio ownloaded. Merging files...");  
                setAudioOnly(false);
            } else {
                setDownloaded("Video downloaded. Downloading audio and merging...");                
            }

            setTimeout(() => {
                setDownloaded("Download completed!");
                setIsDownloadCompleted(true);
            }, 5000);
        } else {
            setDownloaded(value);
        }
        }

        console.log("Done");

        // const data = await requestForDowload.text();
        // console.log(data);
        // const eventSource = new EventSource('/api/sec');

        // eventSource.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     console.log('Received data:', data);
        //     // Update your component state based on the received data
        //   };

        // console.log(data);
    }

    const openDirectory = async (folder: string) => {
        const response = await fetch("/api/open", {
            method: "POST",
            body: JSON.stringify({ videos: folder === "videos" ? true : false })
        });
        const data = await response.json();
        console.log(data);
    }


    const isButtonsDisabled = (downloaded && !downloaded.includes("Download completed")) ? true : false;

    if (response) {
        return (
        <>
            <Button className="px-8 py-6 text-xl my-6" variant="secondary" onClick={() => {
                setResponse(null)
                setUrl(url)
                }}>Go Back</Button>
            <div className="min-h-[70%] flex items-center justify-center flex-col md:flex-row w-full md:w-9/12">
                
                <div className="w-full flex justify-center flex-col items-center">
                    <div className="relative w-11/12 h-[35rem] rounded-xl shadow-shine">
                        <Image className="rounded-xl" fill src={response.thumbnail} alt={response.title} />
                    </div>
                <h1 className="text-center text-2xl mt-5"><Link className="hover:scale-110 hover:underline underline-offset-8" href={`https://youtu.be/${response.videoId}`}>{response.title}</Link></h1>
                </div>

                <div className="flex justify-center flex-col items-center relative w-full h-full max-w-full md:max-w-[50%] overflow-hidden">
                    <div className="flex justify-center items-center text-3xl my-4">
                        <div>{(response && downloaded) && (
                            <div className="flex flex-col items-center">
                                {downloaded}
                                {isDownloadCompleted && (<div>
                                    <Button onClick={() => openDirectory(audioOnly ? "audios" : "videos")}>Open Folder</Button>
                                </div>)}
                            </div>
                        )}</div>
                    </div>
                    <div className="flex justify-center items-center text-3xl my-4">
                        <p>{msToTime(Number(response.video.video360.approxDurationMs))}</p>
                    </div>
                     <h2 className="text-2xl">Download:</h2>
                    <div className="flex flex-col gap-y-2">
                        {response.video.video360 && <Button disabled={isButtonsDisabled} onClick={() => downloadVideo(response.video.video360.url)} className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105">360p - {bytesToSize(Number(response.video.video360.contentLength) + Number(response.audio.contentLength))}</Button>}
                        {response.video.video480 && <Button disabled={isButtonsDisabled} onClick={() => downloadVideo(response.video.video480.url)} className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105">480p - {bytesToSize(Number(response.video.video480.contentLength) + Number(response.audio.contentLength))}</Button>}
                        {response.video.video720 && <Button disabled={isButtonsDisabled} onClick={() => downloadVideo(response.video.video720.url)} className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105">720p - {bytesToSize(Number(response.video.video720.contentLength) + Number(response.audio.contentLength))}</Button>}
                        {response.video.video1080 && <Button disabled={isButtonsDisabled} onClick={() => downloadVideo(response.video.video1080.url)} className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105">1080p - {bytesToSize(Number(response.video.video1080.contentLength) + Number(response.audio.contentLength))}</Button>}
                        {response.video.video720 && <Button disabled={isButtonsDisabled} onClick={() => { 
                            setAudioOnly(true);
                            downloadVideo(response.audio.url, "audios")}} className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105">Audio - {bytesToSize(Number(response.audio.contentLength))}</Button>}
                    </div>
                </div>
                
            </div>
        </>)
        
    } else {
        return (
            <div className="min-h-[70%] flex items-center justify-center flex-col w-full">
            <Input
                value={url}
                disabled={isLoading}
                className="max-w-[90%] md:max-w-[30%] p-6 text-2xl shadow-shine"
                placeholder="Enter Youtube URL"
                onChange={e => setUrl(e.target.value)}
            />
            <span>
                e.g.{" "}
                <code className="text-sm text-zinc-400">
                https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </code>
            </span>
            <Button disabled={isLoading} onClick={() => handleFetch()} className="px-7 text-2xl mt-4 bg-green-600 text-white" variant="secondary">
                Fetch
            </Button>
            </div>
        );
        };
}
export default Main;

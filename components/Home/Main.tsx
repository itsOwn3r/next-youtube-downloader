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
        url: string
    },
    video: {
        video360: {
            contentLength: string,
            url: string
        },
        video480: {
            contentLength: string,
            url: string
        },
        video720: {
            contentLength: string,
            url: string
        },
        video1080: {
            contentLength: string,
            url: string
        },
    }
}

const Main = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState<ResponseType | null>(null);

    console.log(response);

    const bytesToSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFetch = async () => {
        if (!url) {
            return;
        }
        try {
            setIsLoading(true);
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

    if (response) {
        return (
        <>
            <Button className="px-8 py-6 text-xl" variant="secondary" onClick={() => setResponse(null)}>Go Back</Button>
            <div className="min-h-[70%] flex items-center justify-center flex-col md:flex-row w-full md:w-9/12">
                
                <div className="w-full flex justify-center flex-col items-center">
                    <div className="relative w-11/12 h-[35rem] rounded-xl">
                        <Image className="rounded-xl" fill src={response.thumbnail} alt={response.title} />
                    </div>
                <h1 className="text-center text-2xl mt-5"><Link className="hover:scale-110 hover:underline underline-offset-8" href={`https://youtu.be/${response.videoId}`}>{response.title}</Link></h1>
                </div>

                <div className="flex justify-center flex-col items-center relative w-full h-full max-w-[50%] overflow-hidden">
                    <h2 className="text-2xl">Download:</h2>
                    <div className="flex flex-col gap-y-2">
                        <Button className="p-6 text-xl">360p - {bytesToSize(Number(response.video.video360.contentLength))}</Button>
                        <Button className="p-6 text-xl">480p - {bytesToSize(Number(response.video.video480.contentLength))}</Button>
                        <Button className="p-6 text-xl">720p - {bytesToSize(Number(response.video.video720.contentLength))}</Button>
                        <Button className="p-6 text-xl">1080p - {bytesToSize(Number(response.video.video1080.contentLength))}</Button>
                    </div>
                </div>
                
            </div>
        </>)
        
    } else {
        return (
            <div className="min-h-[70%] flex items-center justify-center flex-col w-full">
            <Input
                disabled={isLoading}
                className="max-w-[90%] md:max-w-[30%] p-6 text-2xl"
                placeholder="Enter Youtube URL"
                onChange={e => setUrl(e.target.value)}
            />
            <span>
                e.g.{" "}
                <code className="text-sm text-zinc-400">
                https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </code>
            </span>
            <Button disabled={isLoading} onClick={() => handleFetch()} className="px-7 text-2xl mt-4 bg-green-600" variant="secondary">
                Fetch
            </Button>
            </div>
        );
        };
}
export default Main;

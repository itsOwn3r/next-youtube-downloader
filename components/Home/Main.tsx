"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bytesToSize } from "@/lib/bytesToSize";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from 'react-hot-toast';
import { openDirectory } from "./openDirectory";


interface ResponseType {
  success: boolean;
  videoId: string;
  title: string;
  thumbnail: string;
  fileName: string;
  uploader: string;
  audio: {
    url: string;
    contentLength: string;
  };
  video: {
    video360: {
      contentLength: string;
      url: string;
      approxDurationMs: string;
    };
    video480: {
      contentLength: string;
      url: string;
      approxDurationMs: string;
    };
    video720: {
      contentLength: string;
      url: string;
      approxDurationMs: string;
    };
    video1080: {
      contentLength: string;
      url: string;
      approxDurationMs: string;
    };
  };
}

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<ResponseType | null>(null);

  const [downloaded, setDownloaded] = useState("");
  const [isDownloadCompleted, setIsDownloadCompleted] = useState(false);

  const [audioOnly, setAudioOnly] = useState(false);


  const msToTime = (duration: number) => {
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFetch = async (directURL?: string) => {
    if (!url && !directURL) {
      toast.error("You must provide a URL!", {
        duration: 4000,
        className: "text-xl"
      });
      return;
    }


    let finalURL = url;

    if (directURL) {
      finalURL = directURL;
    }

    if (!finalURL.includes("youtu.be") && !finalURL.includes("youtube")) {
      toast.error("You must provide a valid URL!", {
        duration: 4000,
        className: "text-xl"
      });
      return;
    }
    try {
      setIsLoading(true);
      setDownloaded("");
      setIsDownloadCompleted(false);

      const response = await fetch("/api/fetch", {
        method: "POST",
        body: JSON.stringify({ url: finalURL }),
      });

      if (!response.ok) {
        toast.error("Failed to connect to Youtube...", {
            duration: 4000,
            className: "text-xl"
          });
          return;
      }

      const data = await response.json();

      if (data.success) {
        console.log(data);
        setResponse(data);
      } else {
        toast.error(data.message, {
            duration: 4000,
            className: "text-xl"
          });
      }   
    } catch (error) {
      toast.error((error as Error).message, {
        duration: 4000,
        className: "text-xl"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async (url: string, size: string, folder?: string) => {
    setIsDownloadCompleted(false);
    setDownloaded("");

    try {

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
        audioOnly: folder === "audios" ? true : false,
        uploader: response?.uploader,
        size
      }),
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

      if (value.includes("100.00%")) {
        finishDownload((response?.videoId as string));
        if (folder === "audios") {
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
        setDownloaded(value);
      }
    }
        
    } catch (error) {
        toast.error((error as Error).message, {
            duration: 4000,
            className: "text-xl"
          });
    }

  };







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

  const isButtonsDisabled = downloaded && !downloaded.includes("Download completed") ? true : false;


  

  if (response) {
    return (
      <>
        <Button
          className="px-8 py-6 text-xl my-6"
          variant="secondary"
          onClick={() => {
            setResponse(null);
            setUrl(url);
          }}
        >
          Go Back
        </Button>
        <div className="min-h-[70%] flex items-center justify-center flex-col md:flex-row w-full md:w-9/12">
          <div className="w-full flex justify-center flex-col items-center">
            <div className="relative w-11/12 h-[35rem] rounded-xl shadow-shine">
              <Image
              className="rounded-xl"
              fill
              sizes="100"
              src={`/api/proxy/image?url=${encodeURIComponent(response.thumbnail)}`}
              alt={response.title}
              />
            </div>
            <h1 className="text-center text-2xl mt-5">
              <Link
                className="hover:scale-110 hover:underline underline-offset-8"
                href={`https://youtu.be/${response.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {response.title}
              </Link>
            </h1>
          </div>

          <div className="flex justify-center flex-col items-center relative w-full h-full max-w-full md:max-w-[50%] overflow-hidden">
            <div className="flex justify-center items-center text-3xl my-4">
              <div>
                {response && downloaded && (
                  <div className="flex flex-col items-center">
                    {downloaded}
                    {isDownloadCompleted && (
                      <div className="flex gap-x-2 mt-2">
                        <Button
                          onClick={() =>
                            openDirectory(audioOnly ? "audios" : "videos", audioOnly ? `${response.fileName}.mp3` : `${response.fileName}.mp4`)
                          }
                        >
                          Open File
                        </Button>
                        <Button
                          onClick={() =>
                            openDirectory(audioOnly ? "audios" : "videos")
                          }
                        >
                          Open Folder
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center text-3xl my-4">
              <p>
                {msToTime(Number(response.video.video360.approxDurationMs))}
              </p>
            </div>
            <h2 className="text-2xl">Download:</h2>
            <div className="flex flex-col gap-y-2">
              {response.video.video360 && (
                <Button
                  disabled={isButtonsDisabled}
                  onClick={() => {
                    setAudioOnly(false);
                    downloadVideo(response.video.video360.url, bytesToSize(
                      Number(response.video.video360.contentLength) +
                        Number(response.audio.contentLength)
                    ), "videos");
                    }
                  }
                  className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105"
                >
                  360p -{" "}
                  {bytesToSize(
                    Number(response.video.video360.contentLength) +
                      Number(response.audio.contentLength)
                  )}
                </Button>
              )}
              {response.video.video480 && (
                <Button
                  disabled={isButtonsDisabled}
                  onClick={() => {
                    setAudioOnly(false);
                    downloadVideo(response.video.video480.url, bytesToSize(
                      Number(response.video.video480.contentLength) +
                        Number(response.audio.contentLength)
                    ), "videos");
                  }}
                  className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105"
                >
                  480p -{" "}
                  {bytesToSize(
                    Number(response.video.video480.contentLength) +
                      Number(response.audio.contentLength)
                  )}
                </Button>
              )}
              {response.video.video720 && (
                <Button
                  disabled={isButtonsDisabled}
                  onClick={() => {
                    setAudioOnly(false);
                    downloadVideo(response.video.video720.url, bytesToSize(
                      Number(response.video.video720.contentLength) +
                        Number(response.audio.contentLength)
                    ), "videos");
                    }
                }
                  className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105"
                >
                  720p -{" "}
                  {bytesToSize(
                    Number(response.video.video720.contentLength) +
                      Number(response.audio.contentLength)
                  )}
                </Button>
              )}
              {response.video.video1080 && (
                <Button
                  disabled={isButtonsDisabled}
                  onClick={() => {
                    setAudioOnly(false);
                    downloadVideo(response.video.video1080.url, bytesToSize(
                      Number(response.video.video1080.contentLength) +
                        Number(response.audio.contentLength)
                    ), "videos");
                  }}
                  className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105"
                >
                  1080p -{" "}
                  {bytesToSize(
                    Number(response.video.video1080.contentLength) +
                      Number(response.audio.contentLength)
                  )}
                </Button>
              )}
              {response.video.video720 && (
                <Button
                  disabled={isButtonsDisabled}
                  onClick={() => {
                    setAudioOnly(true);
                    downloadVideo(response.audio.url, bytesToSize(Number(response.audio.contentLength)), "audios");
                  }}
                  className="p-6 text-xl hover:bg-green-600 hover:text-teal-50 hover:scale-105"
                >
                  Audio - {bytesToSize(Number(response.audio.contentLength))}
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="min-h-[70%] flex items-center justify-center flex-col w-full mb-16">
        <h2 className="mb-16 text-xl sm:text-3xl md:text-5xl w-full text-center">
          Next Youtube Downloader !
        </h2>
        <div className="w-full flex justify-center items-center flex-1">
          <div className="max-w-[90%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[35%] shadow-shine flex justify-center items-center flex-1">
            <Input
              value={url}
              disabled={isLoading}
              autoFocus
              className="w-full p-6 text-sm sm:text-lg md:text-xl xl:text-2xl"
              placeholder="Paste Youtube URL"
              onChange={(e) => setUrl(e.target.value)}
              onPaste={async (e) => {
                e.preventDefault();
                const pastedValue = e.clipboardData.getData("Text");

                if (!pastedValue.includes("youtu.be") && !pastedValue.includes("youtube.com")) {
                    toast.error("You must provide a valid URL!", {
                      duration: 4000,
                      className: "text-xl"
                    });
                    return;
                  }
                setUrl(pastedValue);
                await handleFetch(pastedValue);
              }}
            />
          </div>
        </div>
        <span className="mt-2 text-center">
          e.g. <br />
          <code
            className="hover:scale-105 text-sm text-zinc-400 cursor-pointer underline-offset-8 hover:underline"
            onClick={async () => {
              setUrl("https://youtu.be/dQw4w9WgXcQ");
            }}
          >
            https://youtu.be/dQw4w9WgXcQ
          </code>
          <br />
          <code
            className="mt-1 text-sm text-zinc-400 cursor-pointer underline-offset-8 hover:underline"
            onClick={async () => {
              setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }}
          >
            https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </code>
        </span>

        <button
          disabled={isLoading}
          onClick={() => handleFetch()}
          className={cn("mt-4 group relative inline-block items-center justify-center overflow-hidden rounded-lg px-8 py-2.5 font-medium text-indigo-600 shadow-2xl hover:opacity-100 hover:scale-105", isLoading ? "cursor-wait opacity-75" : "cursor-pointer" )}
        >
          <span className="ease absolute left-0 top-0 -ml-3 -mt-10 h-40 w-40 rounded-full bg-red-500 blur-md transition-all duration-700"></span>
          <span className={cn("ease absolute inset-0 h-full w-full transition duration-700 group-hover:rotate-180", isLoading ? "animate-none" : "buttonAnimate")}>
            <span className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500 blur-md"></span>
            <span className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-blue-600 blur-md"></span>
            <span className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-sky-500 blur-md"></span>
            <span className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-green-500 blur-md"></span>
            <span className="absolute bottom-0 right-0 -mr-10 h-24 w-24 rounded-full bg-orange-500 blur-md"></span>
            <span className="absolute bottom-0 right-0 -mr-20 h-24 w-24 rounded-full bg-red-500 blur-md"></span>
          </span>


          <span className="relative text-white opacity-100 text-xl">Fetch Video</span>
        </button>
      </div>
    );
  }
};
export default Main;

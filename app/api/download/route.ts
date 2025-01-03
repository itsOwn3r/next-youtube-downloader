import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';
import { unlink, writeFile } from 'fs/promises';

const streamPipeline = promisify(pipeline);
const execPromise = promisify(exec);

async function downloadFile(url: string, path: string, type: "video" | "audio", writer: WritableStreamDefaultWriter, isDownloaded: { video: boolean, audio: boolean }) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    const totalSize = Number(response.headers.get('content-length'));
    let downloadedSize = 0;

    response.body.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        if (type === "video" && !isDownloaded.video && writer.desiredSize !== null) {
            writer.write(`Downloading video: ${progress.toFixed(2)}%\n\n`);
        }
    });

    response.body.on('end', () => {
        if (type === "video") {
            isDownloaded.video = true;
            writer.close();
        }
        if (type === "audio") {
            isDownloaded.audio = true;
        }
    });

    await streamPipeline(response.body, createWriteStream(path));
}

async function mergeAudioVideo(videoPath: string, audioPath: string, thumbPath: string, outputPath: string) {
    const command = `ffmpeg -y -i ${videoPath} -i ${audioPath} -i ${thumbPath} -map 0:v -map 1:a -map 2 -c:v copy -c:a aac -disposition:v:1 attached_pic "${outputPath}"`;
    await execPromise(command);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const data = await req.json();
        const { url, audio, videoId, title, thumbnail } = data;

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        writer.write('Connection established...');

        const isDownloaded = { video: false, audio: false };
        
        const thumbnailResponse = await fetch(thumbnail);
        if (!thumbnailResponse.ok) throw new Error(`unexpected response ${thumbnailResponse.statusText}`);
        const thumbnailPath = `./public/videos/${videoId}_thumbnail.jpg`;
        const thumbnailBuffer = await thumbnailResponse.buffer();
        await writeFile(thumbnailPath, thumbnailBuffer);
        
        downloadFile(url, './public/videos/downloaded_video.webm', "video", writer, isDownloaded).then(() => console.log("Video downloaded", Math.ceil(Date.now() / 1000)));
        downloadFile(audio, './public/videos/downloaded_audio.webm', "audio", writer, isDownloaded).then(() => console.log("Audio downloaded", Math.ceil(Date.now() / 1000)));


        const interval = setInterval(async () => {
            if (isDownloaded.video && isDownloaded.audio) {
                clearInterval(interval);

                const sanitizedTitle = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
                const nameOfFile = `${sanitizedTitle}~~${videoId}`;
                await mergeAudioVideo('./public/videos/downloaded_video.webm', './public/videos/downloaded_audio.webm', `./public/videos/${videoId}_thumbnail.jpg` , `./public/videos/${nameOfFile}.mp4`);
                console.log("Merge Completed", Math.ceil(Date.now() / 1000));

                await unlink('./public/videos/downloaded_video.webm');
                await unlink('./public/videos/downloaded_audio.webm');
                await unlink(`./public/videos/${videoId}_thumbnail.jpg`);
            }
        }, 1000);

        req.signal.addEventListener('abort', () => {
            console.log("Request aborted");
            writer.close();
        });

        return new NextResponse(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message });
    }
}

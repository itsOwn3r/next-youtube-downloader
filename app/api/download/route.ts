import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';
import { unlink, writeFile } from 'fs/promises';
import { sanitizedFileName } from '@/lib/sanitizedFileName';

const streamPipeline = promisify(pipeline);
const execPromise = promisify(exec);

async function downloadFile(url: string, path: string, type: "video" | "audio", writer: WritableStreamDefaultWriter, isDownloaded: { video: boolean, audio: boolean }, audioOnly?: boolean) {
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
        if (type === "audio" && audioOnly && !isDownloaded.video && writer.desiredSize !== null) {
            writer.write(`Downloading Audio: ${progress.toFixed(2)}%\n\n`);
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
    const command = `ffmpeg -y -i ${videoPath} -i ${audioPath} -i ${thumbPath} -map 0:v -map 1:a -map 2:v -c:v copy -c:a aac -disposition:v:1 attached_pic "${outputPath}"`;
    await execPromise(command);
}

async function mergeAudio(videoId: string, nameOfFile: string) {
    const command = `ffmpeg -y -i "./public/videos/downloaded_audio.webm" -i "./public/videos/${videoId}_thumbnail.jpg" -map 0:a -map 1 -c:a libmp3lame -q:a 2 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" "./public/audios/${nameOfFile}.mp3"`;
    await execPromise(command);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const data = await req.json();
        const { url, audio, videoId, title, thumbnail, audioOnly } = data;

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        writer.write('Connection established...');

        const isDownloaded = { video: false, audio: false };
        
        const thumbnailResponse = await fetch(thumbnail);
        if (!thumbnailResponse.ok) throw new Error(`unexpected response ${thumbnailResponse.statusText}`);
        const thumbnailPath = `./public/videos/${videoId}_thumbnail.jpg`;
        const thumbnailBuffer = await thumbnailResponse.buffer();
        await writeFile(thumbnailPath, thumbnailBuffer);
        
        if (audioOnly) {
            downloadFile(url, './public/videos/downloaded_audio.webm', "audio", writer, isDownloaded, true).then(() => console.log("Audio only downloaded", Math.ceil(Date.now() / 1000)));
        } else {
            downloadFile(url, './public/videos/downloaded_video.webm', "video", writer, isDownloaded).then(() => console.log("Video downloaded", Math.ceil(Date.now() / 1000)));
            downloadFile(audio, './public/videos/downloaded_audio.webm', "audio", writer, isDownloaded).then(() => console.log("Audio downloaded", Math.ceil(Date.now() / 1000)));
        }


            const nameOfFile = sanitizedFileName(title, videoId);

            const interval = setInterval(async () => {

                if (audioOnly && isDownloaded.audio) {
                    clearInterval(interval);

                    await mergeAudio(videoId, nameOfFile);

                    await unlink('./public/videos/downloaded_audio.webm');
                    await unlink(`./public/videos/${videoId}_thumbnail.jpg`);                    
                }

                if (isDownloaded.video && isDownloaded.audio && !audioOnly) {
                    clearInterval(interval);

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
        console.log((error as Error).message);
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}

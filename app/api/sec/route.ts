import { NextRequest, NextResponse } from "next/server";
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';
import { unlink } from 'fs/promises';
export const runtime = 'nodejs';
// This is required to enable streaming
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest){

    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();
    
    writer.write(encoder.encode('Vercel is a platform for....'));

    try {


    const data = await req.json();

    const { url, audio, videoId, title } = data;


    const streamPipeline = promisify(pipeline);
            // const { readable, writable } = new TransformStream();
            // const writer = writable.getWriter();
            // writer.write('data: Connection established\n\n');
        
        
            // req.signal.addEventListener('abort', () => {
            //     console.log("Yeah Aborted!");
            //     writer.close();
            // });

    const downloadVideo = async (url: string, path: string, type: "video" | "audio") => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

        const totalSize = Number(response.headers.get('content-length'));
        let downloadedSize = 0;

        response.body.on('data', async (chunk) => {
            downloadedSize += chunk.length;
            const progress = (downloadedSize / totalSize) * 100;
            console.log(`Download progress: ${progress.toFixed(2)}%`);

            // writer.write(`data: Download progress: ${progress.toFixed(2)}%\n\n`);
            await writer.write(encoder.encode(`data: Download progress: ${progress.toFixed(2)}%\n\n`));
            return new Response(responseStream.readable, {
                headers: {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
                },
            });
        });

        response.body.on('end', () => {
            if (type === "audio") {
                writer.close();
            }
        });

        await streamPipeline(response.body, createWriteStream(path));
        return new Response(responseStream.readable, {
            headers: {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
            },
        });
    
        // return new NextResponse(readable, {
        //     headers: {
        //         'Content-Type': 'text/event-stream',
        //         'Cache-Control': 'no-cache',
        //         'Connection': 'keep-alive',
        //     },
        // });
    };


        await downloadVideo(url, './public/videos/downloaded_video.webm', "video");
        console.log("Video downloaded", Math.ceil(Date.now() / 1000));
        await downloadVideo(audio, './public/videos/downloaded_audio.webm', "audio");
        console.log("Audio downloaded", Math.ceil(Date.now() / 1000));
    
        const nameOfFile = `${title}~~${videoId}`;

    
    
    
        const execPromise = promisify(exec);
        
        const mergeAudioVideo = async (videoPath: string, audioPath: string, outputPath: string) => {
            const command = `ffmpeg -y -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac "${outputPath}"`;
            await execPromise(command);
        };
        
        await mergeAudioVideo('./public/videos/downloaded_video.webm', './public/videos/downloaded_audio.webm', `./public/videos/${nameOfFile}.mp4`);
        console.log("Merge Completed", Math.ceil(Date.now() / 1000));
    
        await unlink('./public/videos/downloaded_video.webm');
        await unlink('./public/videos/downloaded_audio.webm');

    // const interval = setInterval(() => {
    //     writer.write(`data: ${new Date().toISOString()}\n\n`);
    //     const ddd = new Date().getMinutes()
    //     if (ddd === 44) {
    //         clearInterval(interval);
    //         writer.close();
    //     }
    // }, 1000);


    // req.signal.addEventListener('abort', () => {
    //     console.log("Yeah Aborted!");
    //     clearInterval(interval);
    //     writer.close();
    // });

    // writer.close();
    // return new NextResponse(readable, {
    //     headers: {
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache',
    //         'Connection': 'keep-alive',
    //     },
    // });

//     const ready = await writer.ready
// console.log(ready);

        return new Response(responseStream.readable, {
            headers: {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
            },
        });
        // return new NextResponse(readable, {
        //     headers: {
        //         'Content-Type': 'text/event-stream',
        //         'Cache-Control': 'no-cache',
        //         'Connection': 'keep-alive',
        //     },
        // });
    // return NextResponse.json({ success: false });
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message });
    }
}
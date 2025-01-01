import { NextRequest, NextResponse } from "next/server";
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';
import { unlink } from 'fs/promises';

export async function POST(req: NextRequest){

    try {


    const data = await req.json();

    const { url, audio, videoId, title } = data;

    const streamPipeline = promisify(pipeline);

    const downloadVideo = async (url: string, path: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        await streamPipeline(response.body, createWriteStream(path));
    };

    const nameOfFile = `${title}~~${videoId}`

    await downloadVideo(url, './public/videos/downloaded_video.webm');
    console.log("Video downloaded", Math.ceil(Date.now() / 1000));
    await downloadVideo(audio, './public/videos/downloaded_audio.webm');
    console.log("Audio downloaded", Math.ceil(Date.now() / 1000));
    const execPromise = promisify(exec);
    
    const mergeAudioVideo = async (videoPath: string, audioPath: string, outputPath: string) => {
        const command = `ffmpeg -y -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac "${outputPath}"`;
        await execPromise(command);
    };
    
    await mergeAudioVideo('./public/videos/downloaded_video.webm', './public/videos/downloaded_audio.webm', `./public/videos/${nameOfFile}.mp4`);
    console.log("Merge Completed", Math.ceil(Date.now() / 1000));

    await unlink('./public/videos/downloaded_video.webm');
    await unlink('./public/videos/downloaded_audio.webm');
    return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message });
    }
}
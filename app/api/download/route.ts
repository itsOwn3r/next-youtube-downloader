import { NextRequest, NextResponse } from "next/server";
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';

export async function POST(req: NextRequest){

    try {


    const data = await req.json();

    const { url, audio } = data;

    const streamPipeline = promisify(pipeline);

    const downloadVideo = async (url: string, path: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        await streamPipeline(response.body, createWriteStream(path));
    };

    await downloadVideo(url, './downloaded_video.webm');
    console.log("Video downloaded", Math.ceil(Date.now() / 1000));
    await downloadVideo(audio, './downloaded_audio.webm');
    console.log("Audio downloaded", Math.ceil(Date.now() / 1000));
    const execPromise = promisify(exec);
    
    const mergeAudioVideo = async (videoPath: string, audioPath: string, outputPath: string) => {
        const command = `ffmpeg -y -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac ${outputPath}`;
        await execPromise(command);
    };
    
    await mergeAudioVideo('./downloaded_video.webm', './downloaded_audio.webm', './output_video.mp4');
    console.log("Merge Completed", Math.ceil(Date.now() / 1000));
    return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message });
    }
}
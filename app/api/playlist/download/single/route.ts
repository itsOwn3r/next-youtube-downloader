import { bytesToSize } from "@/lib/bytesToSize";
import db from "@/lib/db";
import getProxy from "@/lib/getProxy";
import { sanitizedFileName } from "@/lib/sanitizedFileName";
import { createWriteStream } from "fs";
import { unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';


const streamPipeline = promisify(pipeline);
const execPromise = promisify(exec);


const proxy = await getProxy();

async function downloadFile(url: string, path: string, type: "video" | "audio", writer: WritableStreamDefaultWriter, isDownloaded: { video: boolean, audio: boolean }, audioOnly?: boolean) {
  const response = await fetch(url, { agent: proxy ? proxy : undefined });
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    const totalSize = Number(response.headers.get('content-length'));
    let downloadedSize = 0;

    response.body.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        if (type === "video" && !isDownloaded.video && writer.desiredSize !== null) {
            writer.write(`${progress.toFixed(2)}`);
        }
        if (type === "audio" && audioOnly && !isDownloaded.video && writer.desiredSize !== null) {
            writer.write(`${progress.toFixed(2)}`);
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
    const command = `ffmpeg -y -i "./public/videos/${videoId}_audio.webm" -i "./public/videos/${videoId}_thumbnail.jpg" -map 0:a -map 1 -c:a libmp3lame -q:a 2 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" "./public/audios/${nameOfFile}.mp3"`;
    await execPromise(command);
}





export async function POST(req: Request) {
  try {

    const data = await req.json();

    const { title, type, uploader, videoId, id, playlistId } = data;    

    const getQuality = await db.quality.findUnique({
      where: {
        id: 0
      }
    })

    const quality = getQuality ? getQuality.quality : "480p";


        
        const ytApiResponse = await fetch('https://www.youtube.com/youtubei/v1/player?key', {
            method: 'POST',
            agent: proxy ? proxy : undefined,
            headers: {
              'Host': 'www.youtube.com',
              'content-type': 'application/json',
              'origin': 'https://www.youtube.com',
              'X-YouTube-Client-Name': 'mweb',
              'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 16_7_10 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1,gzip(gfe)',
              'X-Goog-Visitor-Id': 'CgtOb1RUOERRNUtoRSi7mdS7BjIKCgJJUhIEGgAgEw%3D%3D',
              'Connection': 'Keep-Alive',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'fa-IR,en,*',
              'Cookie': 'SOCS=CAI; YSC=Vy698q5UWIs; __Secure-ROLLOUT_TOKEN=CL-E6NKelK6_-wEQrubS-5vUigMYrubS-5vUigM%3D; GPS=1; VISITOR_INFO1_LIVE=NoTT8DQ5KhE; VISITOR_PRIVACY_METADATA=CgJJUhIEGgAgEw%3D%3D'
            },
            body: JSON.stringify({
              'context': {
                'client': {
                  'clientName': 'MWEB',
                  'clientVersion': '2.20241202.07.00',
                  'userAgent': 'Mozilla/5.0 (iPad; CPU OS 16_7_10 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1,gzip(gfe)',
                  'hl': 'en'
                }
              },
              'playbackContext': {
                'contentPlaybackContext': {
                  'html5Preference': 'HTML5_PREF_WANTS',
                  'signatureTimestamp': 20073
                }
              },
              'contentCheckOk': true,
              'racyCheckOk': true,
              'videoId': videoId
            })
          });
    
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const ytApiData = await ytApiResponse.json();
    
        const ytApiResponseWithUrl = await fetch('https://www.youtube.com/youtubei/v1/player?key', {
            method: 'POST',
            agent: proxy ? proxy : undefined,
            headers: {
              'Host': 'www.youtube.com',
              'content-type': 'application/json',
              'origin': 'https://www.youtube.com',
              'X-YouTube-Client-Name': 'ios',
              'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
              'X-Goog-Visitor-Id': 'CgtOb1RUOERRNUtoRSi7mdS7BjIKCgJJUhIEGgAgEw%3D%3D',
              'Content-Length': '440',
              'Connection': 'Keep-Alive',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'fa-IR,en,*',
              'Cookie': 'SOCS=CAI; YSC=Vy698q5UWIs; __Secure-ROLLOUT_TOKEN=CL-E6NKelK6_-wEQrubS-5vUigMYrubS-5vUigM%3D; GPS=1; VISITOR_INFO1_LIVE=NoTT8DQ5KhE; VISITOR_PRIVACY_METADATA=CgJJUhIEGgAgEw%3D%3D'
            },
            body: JSON.stringify({
              'context': {
                'client': {
                  'clientName': 'IOS',
                  'clientVersion': '19.29.1',
                  'deviceMake': 'Apple',
                  'deviceModel': 'iPhone16,2',
                  'userAgent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
                  'osName': 'iPhone',
                  'osVersion': '17.5.1.21F90',
                  'hl': 'en'
                }
              },
              'playbackContext': {
                'contentPlaybackContext': {
                  'html5Preference': 'HTML5_PREF_WANTS',
                  'signatureTimestamp': 20073
                }
              },
              'contentCheckOk': true,
              'racyCheckOk': true,
              'videoId': videoId
            })
          });
          
          const ytApiDataWithURL = await ytApiResponseWithUrl.json();
          
          const audios = ytApiDataWithURL.streamingData.adaptiveFormats.filter((item: { mimeType: string, audioTrack: { audioIsDefault: boolean } }) => (item.mimeType.includes("audio") === true));

          const originalAudio = audios.filter((item: { audioTrack: { audioIsDefault: boolean }}) => {
            if (item.audioTrack === undefined) {
              return false;
            } else if (item.audioTrack.audioIsDefault === undefined) {
              return false;
            }
            return true;
        });
      
          let audioMedium;
      
          if (originalAudio.length !== 0) {
            audioMedium = originalAudio.filter((audio: { audioQuality: string, contentLength: string }) => audio.audioQuality === "AUDIO_QUALITY_MEDIUM").sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
          } else {
            audioMedium = audios.filter((audio: { audioQuality: string, contentLength: string }) => audio.audioQuality === "AUDIO_QUALITY_MEDIUM").sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength)); 
          }

          
        const videos = ytApiDataWithURL.streamingData.adaptiveFormats.filter((item: { mimeType: string }) => item.mimeType.includes("video") === true);
     
        let video;

        if (quality === "360p") {
          video = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "360p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength))[0];
        } else if(quality === "480p") {
          video = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "480p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength))[0];
        
        } else if(quality === "720") {
          video = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "720p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength))[0];
        } else {
          video = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "1080p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength))[0];
        }
    
        // const video360p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "360p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
        // const video480p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "480p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
        // const video720p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "720p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
        // const video1080p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "1080p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
    
    
        let thumbnail = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
    
        const highQualityThumb = await fetch(thumbnail, { agent: proxy ? proxy : undefined });
    

        if (highQualityThumb.status === 404) {
            thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        }
    
        const fileName = sanitizedFileName(title, videoId);

        const size = bytesToSize(Number(video.contentLength) + Number(audioMedium.contentLength))

        const saveToDatabase = await db.download.create({
          data: {
            videoId,
            title,
            type: type === "audio" ? "audio" : "video",
            size,
            uploader,
            link: `https://www.youtube.com/watch?v=${videoId}`,
            date: Math.ceil(Date.now() / 1000),
            thumbnail,
            fileName
          }
        })
        

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const markAsDownloaded = await db.playlistItem.update({
        where: {
          id,
          playlistId
        },
        data: {
          downloadId: saveToDatabase.id
        }
      })


      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      const isDownloaded = { video: false, audio: false };

      const thumbnailResponse = await fetch(thumbnail, { agent: proxy ? proxy : undefined });
      
      const thumbnailPath = `./public/videos/${videoId}_thumbnail.jpg`;
      const thumbnailBuffer = await thumbnailResponse.buffer();
      await writeFile(thumbnailPath, thumbnailBuffer);

      if (type === "audio") {
        downloadFile(audioMedium.url, `./public/videos/${videoId}_audio.webm`, "audio", writer, isDownloaded, true).then(() => {});
    } else {
        downloadFile(video.url, `./public/videos/${videoId}.webm`, "video", writer, isDownloaded).then(() => {});
        downloadFile(audioMedium.url, `./public/videos/${videoId}_audio.webm`, "audio", writer, isDownloaded).then(() => {});
    }

    const interval = setInterval(async () => {
    
                    if (type === "audio" && isDownloaded.audio) {
                        clearInterval(interval);
    
                        await mergeAudio(videoId, fileName);
    
                        await unlink(`./public/videos/${videoId}_audio.webm`);
                        await unlink(`./public/videos/${videoId}_thumbnail.jpg`);                    
                    }
    
                    if (isDownloaded.video && isDownloaded.audio && type !== "audio") {
                        clearInterval(interval);
    
                        await mergeAudioVideo(`./public/videos/${videoId}.webm`, `./public/videos/${videoId}_audio.webm`, `./public/videos/${videoId}_thumbnail.jpg` , `./public/videos/${fileName}.mp4`);
    
                        await unlink(`./public/videos/${videoId}.webm`);
                        await unlink(`./public/videos/${videoId}_audio.webm`);
                        await unlink(`./public/videos/${videoId}_thumbnail.jpg`);
                }
            }, 1000);
    
            req.signal.addEventListener('abort', () => {
                writer.close();
            });
    
            return new NextResponse(readable, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });



    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 }
    );
  }
}

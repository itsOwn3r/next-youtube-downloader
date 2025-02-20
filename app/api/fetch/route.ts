import { sanitizedFileName } from "@/lib/sanitizedFileName";
import { NextRequest, NextResponse } from "next/server";
import fetch from 'node-fetch';
import getProxy from "@/lib/getProxy";

// import { writeFileSync } from "fs";

export async function POST(req: NextRequest){

  try {

    const data = await req.json();

    const { url } = data;

    if (!url) {
        return NextResponse.json({ success: false, message: "Youtube URL Must Be Provided!" });
    }
    let videoId;
    if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
    } else {
        if (url.includes("/shorts/")) {
            videoId = url.split("/shorts/")[1];
        } else {
            videoId = url.split("v=")[1];
        }
    }
    
    if (videoId.includes("?")) {
        videoId = videoId.split("?")[0];
    }

    const proxy = await getProxy();
    
    const response = await fetch(`https://m.youtube.com/watch?v=${videoId}`, {
      agent: proxy ? proxy : undefined,
      headers: {
      'Host': 'm.youtube.com',
      'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-us,en;q=0.5',
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'Connection': 'Keep-Alive',
      'Cookie': 'SOCS=CAI; YSC=Vy698q5UWIs; __Secure-ROLLOUT_TOKEN=CL-E6NKelK6_-wEQrubS-5vUigMYrubS-5vUigM%3D; GPS=1; VISITOR_INFO1_LIVE=NoTT8DQ5KhE; VISITOR_PRIVACY_METADATA=CgJJUhIEGgAgEw%3D%3D'
      }
    });

    const html = await response.text();


    const regex = /"videoDetails":{"videoId":"(.*)","title":"(.*?)"/;
    const match = html.match(regex);

    const regexForUploader = /,"ownerChannelName":"(.*?)","/;
    const matchForUploader = html.match(regexForUploader);

    let title;
    let uploader;

    if (match && match[2]) {
        title = match[2];
    } else {
        title = "Error in fetching  video's title";
    }

    if (matchForUploader && matchForUploader[1]) {
        uploader = matchForUploader[1];
    } else {
        uploader = "Failed to get Uploader";
    }

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
 

    const video360p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "360p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
    const video480p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "480p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
    const video720p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "720p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));
    const video1080p = (videos.filter((video: { qualityLabel: string, contentLength: string }) => video.qualityLabel === "1080p") || [{ contentLength: "1"}, { contentLength: "2"}]).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b?.contentLength) - parseInt(a?.contentLength));


    let thumbnail = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;

    const highQualityThumb = await fetch(thumbnail, { agent: proxy ? proxy : undefined });

    if (url.includes("/shorts/")) {
      thumbnail = `https://i.ytimg.com/vi/${videoId}/oar2.jpg`
    } else if (highQualityThumb.status === 404) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }

    const fileName = sanitizedFileName(title, videoId);
    return NextResponse.json({ success: true, videoId, title, thumbnail, uploader, fileName, audio: audioMedium[0], video: { video360: video360p[0], video480: video480p[0], video720: video720p[0], video1080: video1080p[0] }});

        
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json({ success: false, message: (error as Error).message}, { status: 400 });
  }
  }
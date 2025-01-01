import { NextRequest, NextResponse } from "next/server";
// import { writeFileSync } from "fs";

export async function POST(req: NextRequest){

    const data = await req.json();

    const { url } = data;

    if (!url) {
        return NextResponse.json({ success: false, message: "Youtube URL Must Be Provided!" });
    }

    let videoId;

    if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
    } else {
        videoId = url.split("v=")[1];
    }

    if (videoId.includes("?")) {
        videoId = videoId.split("?")[0];
    }

    const response = await fetch(`https://m.youtube.com/watch?v=${videoId}`, {
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

    let title;

    if (match && match[2]) {
        console.log(match[2]);
        title = match[2]
    } else {
        console.log("Title not found");
        title = "Error in fetching  video's title";
    }

    const ytApiResponse = await fetch('https://www.youtube.com/youtubei/v1/player?key', {
        method: 'POST',
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

      const ytApiData = await ytApiResponse.json();

    const audios = ytApiData.streamingData.adaptiveFormats.filter((item: { mimeType: string }) => item.mimeType.includes("audio") === true);
    const audioMedium = audios.filter((audio: { audioQuality: string, contentLength: string }) => audio.audioQuality === "AUDIO_QUALITY_MEDIUM").sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b.contentLength) - parseInt(a.contentLength));

    const videos = ytApiData.streamingData.adaptiveFormats.filter((item: { mimeType: string }) => item.mimeType.includes("video") === true);
 

    const video360p = videos.filter((video: { height: number, contentLength: string }) => video.height === 360).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b.contentLength) - parseInt(a.contentLength));
    const video480p = videos.filter((video: { height: number, contentLength: string }) => video.height === 480).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b.contentLength) - parseInt(a.contentLength));
    const video720p = videos.filter((video: { height: number, contentLength: string }) => video.height === 720).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b.contentLength) - parseInt(a.contentLength));
    const video1080p = videos.filter((video: { height: number, contentLength: string }) => video.height === 1080).sort((a: { contentLength: string }, b: { contentLength: string }) => parseInt(b.contentLength) - parseInt(a.contentLength));


    return NextResponse.json({ success: true, videoId, title, audio: audioMedium[0], video360: video360p[0], video480: video480p[0], video720: video720p[0], video1080: video1080p[0] });
}
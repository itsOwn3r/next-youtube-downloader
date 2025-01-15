import db from "@/lib/db";
import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {

  const getTrackingParams = async (text: string) => {
    const trackingParamsMatch = text.match(/"request":"CONTINUATION_REQUEST_TYPE_BROWSE"}}}}],"trackingParams":"(.*?)"/);
    const trackingParams = trackingParamsMatch ? trackingParamsMatch[1] : null;
    return trackingParams;
  }

  const getTrackingParamsInLoop = async (text: string) => {
    const tokenMatch = text.match(/"continuationCommand":{"token":"(.*?)"/);
    const token = tokenMatch ? tokenMatch[1] : null;
    return token;
  }



  const getToken = async (text: string) => {
    const tokenMatch = text.match(/"continuationCommand":{"token":"(.*?)"/);
    const token = tokenMatch ? tokenMatch[1] : null;
    return token;
  }


  try {

    const data = await req.json();

    const { title, autoUpdate, link } = data;

    if (!title || !autoUpdate || !link) {
      return NextResponse.json({ success: false, message: "You must provide valid data!" }, { status: 400 });
    }

    const getPlaylist = await fetch(link, {
      headers: {
        'Host': 'www.youtube.com',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-us,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': 'SOCS=CAI; YSC=Vy698q5UWIs; GPS=1; __Secure-ROLLOUT_TOKEN=CIbc9emAgfuNYhDLtcztlviKAxjLtcztlviKAw%3D%3D; VISITOR_INFO1_LIVE=ZvobdSNOOcE; VISITOR_PRIVACY_METADATA=CgJJUhIEGgAgYQ%3D%3D'
      }
    });

    const responseOfPlaylist = await getPlaylist.text();
    // writeFileSync("./responseOfPlaylist.html", responseOfPlaylist);

    // const trackingParamsMatch = responseOfPlaylist.match(/"request":"CONTINUATION_REQUEST_TYPE_BROWSE"}}}}],"trackingParams":"(.*?)"/);
    // const trackingParams = trackingParamsMatch ? trackingParamsMatch[1] : null;

    const totalVideosMatch = responseOfPlaylist.match(/"content":"(\d+) videos"/);
    const totalVideos = totalVideosMatch ? totalVideosMatch[1] : null;
    console.log("totalVideos ", totalVideos);


    
    const getContent = responseOfPlaylist.match(/"itemSectionRenderer":{"contents":(.*?)"continuationItemRenderer"/);
    const contentsTemplate = getContent ? getContent[1] : null;
    
    // writeFileSync("./hugeResponse.json", JSON.stringify(contentsTemplate));
    if (!contentsTemplate) {
      return NextResponse.json({ success: false, message: "Item section contentsTemplate not found!" }, { status: 400 });
    }

    const dataHolder: {videoId: string, title: string, videoLength: string, uploader: string}[] = [];
    
    const indexOfTracking = contentsTemplate.lastIndexOf(`],"trackingParams"`);
    
    let stringifiedContent = contentsTemplate.slice(0, indexOfTracking + 1);
    
    stringifiedContent = stringifiedContent.replace(`[{"playlistVideoListRenderer":{"contents":`, "");
    const findTail = stringifiedContent.lastIndexOf(`}]}}},{"playlistVideoRenderer"`);
    const removeTail = stringifiedContent.slice(0, findTail + 5);
    
    const finalString = `${removeTail}]`
    // writeFileSync("./hugeResponse.json", finalString);

    const overStringift = JSON.stringify(`${finalString}`)
    console.log("Chaaaaaaak");
    const content = JSON.parse(overStringift);
    // writeFileSync("./hugeResponse.json", content);
    
    const finalContent = JSON.parse(content);
    
    console.log("Length pf content: ",  finalContent.length);
    for (const item of finalContent) {
      dataHolder.push({ videoId: item.playlistVideoRenderer?.videoId, title: item.playlistVideoRenderer?.title.runs[0].text, videoLength: item.playlistVideoRenderer?.lengthText.simpleText, uploader: item.playlistVideoRenderer?.shortBylineText.runs[0].text })
    }
      console.log("Chiiiik");
    
    // console.log("trackingParams ", trackingParams);
    
    // const tokenMatch = responseOfPlaylist.match(/"continuationCommand":{"token":"(.*?)"/);
    // const token = tokenMatch ? tokenMatch[1] : null;


    // if (!trackingParams || !token) {
    //   return NextResponse.json({ success: false, message: "Required parameters not found in the playlist response!" }, { status: 400 });
    // }

    if (Number(totalVideos) < 99) {
      // TODO
      return NextResponse.json({ success: false });
    }

    const numberOfLoops = Math.ceil(Number(totalVideos) / 100);

    const loops = Array.from({ length: numberOfLoops }, (_, i) => i + 1);

    let trackingParams = await getTrackingParams(responseOfPlaylist);
    
    let token = await getToken(responseOfPlaylist);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const item of loops) {
          

    console.log("Token is ");
    console.log(token);
    console.log("Hehe");
    console.log(trackingParams);
    console.log("Ok");

    if (!token || !trackingParams) {
      console.log("No Valid Data");
      break;
      return NextResponse.json({ success: false });
    }

      const getPlaylistVideos = await fetch('https://www.youtube.com/youtubei/v1/browse?key', {
        method: 'POST',
        headers: {
          'Host': 'www.youtube.com',
          'content-type': 'application/json',
          'origin': 'https://www.youtube.com',
          'X-YouTube-Client-Name': 'web',
          'X-Goog-Visitor-Id': 'CgtBam1kd1RIcFo5MCjn1568BjIKCgJJUhIEGgAgEg%3D%3D',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'fa-IR,en,*',
          'Cookie': 'SOCS=CAI; YSC=Vy698q5UWIs; GPS=1; __Secure-ROLLOUT_TOKEN=CMPs6uLqkrmxHRDNiYT23veKAxjNiYT23veKAw%3D%3D; VISITOR_INFO1_LIVE=AjmdwTHpZ90; VISITOR_PRIVACY_METADATA=CgJJUhIEGgAgEg%3D%3D'
        },
        body: JSON.stringify({
          'context': {
            'client': {
              'clientName': 'WEB',
              'clientVersion': '2.20241126.01.00',
              'hl': 'en'
            }
          },
          'playbackContext': {
            'contentPlaybackContext': {
              'html5Preference': 'HTML5_PREF_WANTS',
              'signatureTimestamp': 20097
            }
          },
          'contentCheckOk': true,
          'racyCheckOk': true,
          'continuation': token,
          'clickTracking': {
            'clickTrackingParams': trackingParams
          }
        })
      });
  
      const response = await getPlaylistVideos.json();

      const data = response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems || [];
      console.log("Length pf data: ", data.length);
      for (const item of data) {
        dataHolder.push({ title: item.playlistVideoRenderer?.title.runs[0].text , uploader: item.playlistVideoRenderer?.shortBylineText.runs[0].text , videoId: item.playlistVideoRenderer?.videoId , videoLength: item.playlistVideoRenderer?.lengthText.simpleText });
      }
     // 🌞
      // writeFileSync("./contentResponse.json", JSON.stringify(response));
      const stringifiedContents = JSON.stringify(response);
      
      trackingParams = await getTrackingParamsInLoop(stringifiedContents);

      token = await getToken(stringifiedContents);


    }

    
    // writeFileSync("./AHaHaResponse.json", JSON.stringify(dataHolder));
    // console.log(content);


    // console.log(contentsTemplate);


    return NextResponse.json({ success: true });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 400 }
    );
  }
}

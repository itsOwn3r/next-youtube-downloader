import db from "@/lib/db";
import getProxy from "@/lib/getProxy";
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

      const proxy = await getProxy();
    

    const getPlaylist = await fetch(link, {
      agent: proxy ? proxy : undefined,
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

    
    const totalVideosMatch = responseOfPlaylist.match(/"content":"(\d+) videos"/);
    const totalVideos = totalVideosMatch ? totalVideosMatch[1] : null;
 


    
    let playListId = link.split("list=")[1];

    if (playListId.includes("&")) {
      playListId = playListId.split("&")[0];
    }

    const dataHolder: {videoId: string, title: string, videoLength: string, uploader: string}[] = [];

    
        
    const getContent = responseOfPlaylist.match(new RegExp(`\\[{"itemSectionRenderer":{"contents":\\[{"playlistVideoListRenderer":{"contents":(.*),"playlistId":"${playListId}","isEditable"`));
    const contentsTemplate = getContent ? getContent[1] : null;

        
    if (!contentsTemplate) {
      return NextResponse.json({ success: false, message: "Item section contentsTemplate not found!" }, { status: 400 });
    }


    const finalContent = JSON.parse(contentsTemplate);


    for (const item of finalContent) {
      dataHolder.unshift({ videoId: item.playlistVideoRenderer?.videoId, title: item.playlistVideoRenderer?.title.runs[0].text, videoLength: item.playlistVideoRenderer?.lengthText.simpleText, uploader: item.playlistVideoRenderer?.shortBylineText.runs[0].text })
    }


    const numberOfLoops = Number(totalVideos) < 100 ? 0 : Math.ceil((Number(totalVideos) - 99) / 100);

    const loops = Array.from({ length: numberOfLoops }, (_, i) => i + 1);

    let trackingParams = await getTrackingParams(responseOfPlaylist);
    
    let token = await getToken(responseOfPlaylist);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of loops) {

    if (!token || !trackingParams) {
      break;
    }

      const getPlaylistVideos = await fetch('https://www.youtube.com/youtubei/v1/browse?key', {
        method: 'POST',
        agent: proxy ? proxy : undefined,
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

      for (const item of data) {
        dataHolder.unshift({ title: item.playlistVideoRenderer?.title.runs[0].text , uploader: item.playlistVideoRenderer?.shortBylineText.runs[0].text , videoId: item.playlistVideoRenderer?.videoId , videoLength: item.playlistVideoRenderer?.lengthText.simpleText });
      }

      const stringifiedContents = JSON.stringify(response);
      
      trackingParams = await getTrackingParamsInLoop(stringifiedContents);

      token = await getToken(stringifiedContents);

    }

    const imageUrl = `https://i.ytimg.com/vi/${dataHolder[dataHolder.length - 1].videoId}/hqdefault.jpg`;


    const createPlaylist = await db.playlist.create({
      data: {
        id: playListId,
        title,
        autoUpdate,
        url: link,
        numberOfItems: totalVideos ? Number(totalVideos) : 0,
        imageUrl: imageUrl ? imageUrl : "",
      }
    });


    const items: {videoId: string, title: string, videoLength: string, uploader: string, playlistId: string }[] = dataHolder
      .filter(item => item !== undefined && item.videoId && item.title && item.uploader && item.videoLength)
      .map(item => ({
        videoId: item.videoId,
        title: item.title,
        videoLength: item.videoLength,
        uploader: item.uploader,
        playlistId: createPlaylist.id,
      }));


    const createPlaylistItems = await db.playlistItem.createMany({
      data: items
    });


    return NextResponse.json({ success: true, count: createPlaylistItems.count });
  } catch (error) {
    console.log((error as Error).message);
    if ((error as Error).message.includes("Unique constraint failed on the constraint")) {
      
      return NextResponse.json(
        {
          success: false,
        message: "Playlist already exist!",
      },
      { status: 400 }
    );      
    } else {
      return NextResponse.json(
        {
          success: false,
        message: (error as Error).message,
      },
      { status: 400 }
    );
  }
  }
}

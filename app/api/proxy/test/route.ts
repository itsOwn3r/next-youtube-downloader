import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const data = await req.json();

    const { protocol, ip, port } = data;

    if (!protocol || !ip || !port || !protocol.includes("http")) {
      return NextResponse.json({ success: false, message: "You must provide valid data!" })
    }

  
      const proxyString = `${protocol}://${ip}:${port}`;
      const agent = new HttpsProxyAgent(proxyString);
    
      const response = await fetch(`https://m.youtube.com/watch?v=dQw4w9WgXcQ`, {
        agent,
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const html = await response.text();


    return NextResponse.json({ success: true, message: "Proxy is valid!" })
    

  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      {
      success: false,
      message: "YouTube is inaccessible!",
      },
      { status: 400 }
    );
  }
}

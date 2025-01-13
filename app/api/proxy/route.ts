import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {

    const data = await req.json();

    const { protocol, ip, port } = data;

    if (!protocol || !ip || !port || !protocol.includes("http")) {
      return NextResponse.json({ success: false, message: "You must provide valid data!" })
    }

    const findProxy = await db.proxy.findUnique({
      where: {
        id: 0
      }
    });

    if (!findProxy) {
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const saveProxyToDB = await db.proxy.create({
      data: {
        id: 0,
        ip,
        port,
        protocol
      }
    })

      return NextResponse.json({ success: true, message: "Proxy is now set and activated!" });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editProxy = await db.proxy.update({
      where: {
        id: 0
      },
      data: {
        ip,
        port,
        protocol
      }
    })



    return NextResponse.json({ success: true, message: "Proxy changed!" })
    

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

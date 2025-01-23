import { NextResponse } from "next/server";
import db from '@/lib/db';

export async function POST() {
  try {

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
        ip: "127.0.0.1",
        port: 443,
        protocol: "HTTP",
        isActive: true
      }
    })

      return NextResponse.json({ success: true, message: "A default proxy has been set!" });
    }
    
    if (findProxy.isActive) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const disableProxy = await db.proxy.update({
        where: {
          id: 0
        },
        data: {
          isActive: false
        }
      })



      return NextResponse.json({ success: true, message: "Proxy deactivated!" });

    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activateProxy = await db.proxy.update({
        where: {
          id: 0
        },
        data: {
          isActive: true
        }
      })



      return NextResponse.json({ success: true, message: "Proxy activated!" })            
    }

    

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

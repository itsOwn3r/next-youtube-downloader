import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const data = await req.json();

    const { quality } = data;

    if (!quality || !["360p", "480p", "720p", "1080p"].includes(quality)) {
      return NextResponse.json({ success: false, message: "You must provide valid data!" })
    }

    const findDefaultQuality = await db.quality.findUnique({
      where: {
        id: 0
      }
    })

    if (!findDefaultQuality) {
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createDefaultQuality = await db.quality.create({
        data: {
          id: 0,
          quality
        }
      })
      
    return NextResponse.json({ success: true, message: `Default quality set to ${quality}!` });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateDefaultQuality = await db.quality.update({
        where: {
          id: 0,
        },
        data: {
          quality
        }
      })
    return NextResponse.json({ success: true, message: `Default quality set to ${quality}!` })
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

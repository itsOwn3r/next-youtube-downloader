import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

export async function POST(req: NextRequest) {
  try {
    
    const data = await req.json();

    const { videos } = data;
    const folderName = videos ? "videos" : "audios";
    
    const execPromise = promisify(exec);
    const command = `start .\\public\\${folderName}`;
    
    await execPromise(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}

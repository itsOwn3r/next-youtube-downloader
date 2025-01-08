import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { videos, file } = data;
    console.log(data);
    const folderName = videos ? "videos" : "audios";

    const currentPath = process.cwd();
    console.log(currentPath);

    let command = "";

    if (file) {
      command = `start "" "${currentPath}\\public\\${folderName}\\${file}"`;      
    } else {
      command = `start "" "${currentPath}\\public\\${folderName}"`;
    }

    console.log(command);
    exec(command);

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

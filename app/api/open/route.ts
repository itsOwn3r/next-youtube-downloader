import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

export async function GET() {
  try {
    const execPromise = promisify(exec);
    const command = `start .\\public\\videos`;
    await execPromise(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}

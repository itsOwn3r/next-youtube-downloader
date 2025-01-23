import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request",
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteFromHistory = await db.download.delete({
      where: {
        id: Number(id)
      }
    })


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

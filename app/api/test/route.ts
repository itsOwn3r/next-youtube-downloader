import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    writer.write('data: Connection established\n\n');

    const interval = setInterval(() => {
        writer.write(`data: ${new Date().toISOString()}\n\n`);
        const ddd = new Date().getMinutes()
        if (ddd === 44) {
            clearInterval(interval);
            writer.close();
        }
    }, 1000);

    req.signal.addEventListener('abort', () => {
        console.log("Yeah Aborted!");
        clearInterval(interval);
        writer.close();
    });

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
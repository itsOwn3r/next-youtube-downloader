import { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "History - YouTube Downloader",
  description: "A History of downloaded Videos and Audios.",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative flex min-h-svh flex-col bg-background">
        <div className="border-grid flex flex-1 flex-col">

          {children}

          <footer className="border-grid border-t py-6 md:px-8 md:py-0">
            <div className="container-wrapper">
              <div className="container py-4">
                <div className="ml-1 text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by {" "}
                  <Link
                    href="https://own3r.me"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    Own3r
                  </Link>
                  . Consider starring the project on {" "}
                  <Link
                    href="https://github.com/itsOwn3r/next-youtube-downloader"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    GitHub
                  </Link>
                  .
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

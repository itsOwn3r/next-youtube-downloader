import { Metadata } from "next";

import { HistoryNav } from "@/components/HistoryNav";
import Header from "@/components/Home/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Examples",
  description: "Check out some examples app built using the components.",
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div vaul-drawer-wrapper="">
      <div className="relative flex min-h-svh flex-col bg-background">
        <div data-wrapper="" className="border-grid flex flex-1 flex-col">
          <Header />
          <main className="flex flex-1 flex-col">
            <div className="border-grid border-b">
              <div className="container-wrapper">
                <div className="container py-4">
                  <HistoryNav />
                </div>
              </div>
            </div>
            <div className="container-wrapper">
              <div className="container py-6">
                <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                  {children}
                </section>
              </div>
            </div>
          </main>
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

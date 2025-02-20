import { Metadata } from "next";

import { columns } from "@/components/History/columns";
import { DataTable } from "@/components/History/data-table";
import Header from "@/components/Home/Header";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "History - YouTube Downloader",
  description: "A History of downloaded Videos and Audios.",
};

async function getHistory() {
  try {
    const devUrl = process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
    const response = await fetch(`${devUrl}/api/history`, { cache: 'no-store' });
    const data = await response.json();

    return data.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
}

export default async function HistoryPage() {
  const tasks = await getHistory();

  const proxy = await db.proxy.findUnique({
    where: {
      id: 0,
    },
  });

  
  const quality = await db.quality.findUnique({
    where: {
      id: 0
    }
  })

  return (
    <>
      <Header proxy={proxy} quality={quality?.quality || "480p"} />
      <main className="flex flex-1 flex-col">
        <div className="container-wrapper">
          <div className="container py-6">
            <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
              <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
                <div className="flex items-center justify-between space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Welcome back!
                    </h2>
                    <p className="text-muted-foreground">
                      Here&apos;s a list of downloaded Videos and Audios!
                    </p>
                  </div>
                </div>
                <DataTable data={tasks} columns={columns} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

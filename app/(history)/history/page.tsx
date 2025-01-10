import { Metadata } from "next"

import { columns } from "@/components/History/columns"
import { DataTable } from "@/components/History/data-table"

export const metadata: Metadata = {
  title: "History - YouTube Downloader",
  description: "A History of downloaded Videos and Audios.",
}


async function getHistory() {
  const devUrl = process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
  const response = await fetch(`${devUrl}/api/history`);
  const data = await response.json();

  return data.data;
}

export default async function HistoryPage() {
  const tasks = await getHistory();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of downloaded Videos and Audios!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}

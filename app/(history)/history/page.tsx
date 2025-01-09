import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"

import { columns } from "../../../components/History/columns"
import { DataTable } from "../../../components/History/data-table"
import { taskSchema } from "../../../components/data/schema"

export const metadata: Metadata = {
  title: "History - YouTube Downloader",
  description: "A History of downloaded Videos and Audios.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/components/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()

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

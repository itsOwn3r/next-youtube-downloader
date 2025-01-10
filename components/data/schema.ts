import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  link: z.string(),
  videoId: z.string(),
  fileName: z.string(),
  uploader: z.string(),
  size: z.string(),
  thumbnail: z.string(),
  isDownloaded: z.boolean(),
  date: z.number(),
})

export type Task = z.infer<typeof taskSchema>

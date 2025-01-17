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

export const playlistSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string().nullable(),
  numberOfItems: z.number().optional(),
  autoUpdate: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  imageUrl: z.string(),
})

export type Playlist = z.infer<typeof playlistSchema>

export const playlistItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  videoId: z.string(),
  videoLength: z.string(),
  uploader: z.string(),
  playlistId: z.string(),
  downloadId: z.number().nullable(),
  createdAt: z.string(),
})

export type PlaylistItem = z.infer<typeof playlistItemSchema>

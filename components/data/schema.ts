import { z } from "zod"


export const historySchema = z.object({
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

export type History = z.infer<typeof historySchema>

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

import type { Short } from "@/shared/types/models"

export interface NormalizedShort {
  id: number
  authorId?: number
  author?: Short["author"]
  username?: string
  avatarUrl?: string
  videoUrl: string
  caption?: string
  likes: number
  comments: number
  liked: boolean
  saved: boolean
  timestamp: string
}

export function normalizeShort(raw: Short): NormalizedShort {
  const videoUrl = raw.videoUrl ?? raw.video_url ?? ""
  const likes = raw.likes ?? raw.likes_count ?? 0
  const comments = raw.comments ?? raw.comments_count ?? 0
  const liked = raw.liked ?? raw.is_liked ?? false
  const saved = raw.saved ?? raw.is_saved ?? false
  const timestamp = raw.timestamp ?? raw.created_at ?? raw.createdAt ?? ""
  const avatarUrl = raw.avatarUrl ?? raw.author?.avatarUrl ?? raw.avatar_url
  const username = raw.username ?? raw.author?.username ?? ""

  return {
    id: raw.id,
    authorId: raw.authorId ?? raw.author?.id,
    author: raw.author,
    username,
    avatarUrl,
    videoUrl,
    caption: raw.caption,
    likes,
    comments,
    liked,
    saved,
    timestamp,
  }
}

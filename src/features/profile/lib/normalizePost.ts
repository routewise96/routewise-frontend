import type { Post as ApiPost } from "@/shared/types/models"

export interface PostCardPost {
  id: number
  username: string
  avatarUrl?: string
  location: string
  timestamp: string
  imageUrl?: string
  caption: string
  hashtags: string[]
  likes: number
  comments: number
  liked: boolean
  saved: boolean
}

export function normalizePost(raw: ApiPost | Record<string, unknown>, fallbackUsername = ""): PostCardPost {
  const r = raw as Record<string, unknown>
  const author = r.author as Record<string, unknown> | undefined
  return {
    id: (r.id as number) ?? 0,
    username: (r.username as string) ?? (author?.username as string) ?? fallbackUsername,
    avatarUrl: (r.avatarUrl as string) ?? (r.avatar_url as string) ?? (author?.avatarUrl as string) ?? (author?.avatar_url as string),
    location: (r.location as string) ?? "",
    timestamp: (r.timestamp as string) ?? (r.created_at as string) ?? (r.createdAt as string) ?? "",
    imageUrl: (r.imageUrl as string) ?? (r.image_url as string),
    caption: (r.caption as string) ?? (r.text as string) ?? (r.content as string) ?? "",
    hashtags: (r.hashtags as string[]) ?? (r.tags as string[]) ?? [],
    likes: (r.likes as number) ?? (r.likes_count as number) ?? 0,
    comments: (r.comments as number) ?? (r.comments_count as number) ?? 0,
    liked: (r.liked as boolean) ?? (r.is_liked as boolean) ?? false,
    saved: (r.saved as boolean) ?? (r.is_saved as boolean) ?? false,
  }
}

import type { Post } from "@/shared/types/models"

export function extractPosts(data: unknown): Post[] {
  if (Array.isArray(data)) return data as Post[]
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.posts)) return o.posts as Post[]
    if (Array.isArray(o.data)) return o.data as Post[]
    if (Array.isArray(o.items)) return o.items as Post[]
  }
  return []
}

